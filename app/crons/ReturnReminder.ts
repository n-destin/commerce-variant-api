import cron from "node-cron";
import { Order } from "../database/Order";
import moment from "moment";
import nodemailer from "nodemailer";
import { IOrder, IOrderDto, IOrderResponse } from "../types/order.type";
import { appConfig } from "../config/app";
import mongoose from "mongoose";
import { User } from "../database/User";
import { ObjectId } from "mongodb";

// Configure nodemailer with email service provider details
const transporter = nodemailer.createTransport({
  service: appConfig.mailerService,
  auth: {
    user: appConfig.mailerUsernmae,
    pass: appConfig.mailerPassword,
  },
});

// Function to send email reminders
const sendReminderEmail = async (
  email: string,
  reminderMessage: string,
  order: IOrder,
) => {
  const message =
    reminderMessage +
    `\nExpected return date: \t${order.expectedReturnDate
      ?.toISOString()
      .slice(0, 10)}\n\nThis is a reminder for order with ref #${
      order._id
    }.\nTo view details visit ${appConfig.frontEndUrl}/dashboard/orders?orderId=${
      order._id
    }`;
  const mailOptions = {
    from: appConfig.mailerUsernmae,
    to: email,
    subject: "Product Return Reminder",
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email reminder sent to ${email} for Order ID: ${order._id}`);
  } catch (error) {
    console.error("Error sending email reminder:", error);
  }
};

cron.schedule("0 5 * * *", async () => {
  // 5 AM in the morning
  try {
    await mongoose.connect(appConfig.databaseUrl);

    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    const orders = (await Order.find({
      deliveryStatus: "DELIVERED",
      days: { $exists: true },
      returnedDate: { $exists: false },
    }).lean()) as IOrder[];

    const usersIds = orders.map((order) => order.orderer);
    const users = await User.find({ _id: { $in: usersIds } });

    users.forEach(async (user) => {
      const userOrders = orders.filter((order) =>
        order.orderer.equals(
          user._id instanceof ObjectId ? user._id : new ObjectId(user._id),
        ),
      );
      if (userOrders) {
        userOrders.forEach(async (order) => {
          const expectedReturnDate = new Date(order.expectedReturnDate || "");
          expectedReturnDate.setUTCHours(0, 0, 0, 0);

          if (expectedReturnDate && user.email) {
            const timeDifference =
              expectedReturnDate.getTime() - currentDate.getTime();
            const daysUntilReturn = Math.ceil(
              timeDifference / (1000 * 60 * 60 * 24),
            );

            if (daysUntilReturn === 2) {
              await sendReminderEmail(
                user.email,
                "You have to return the product in two days.",
                order,
              );
            } else if (daysUntilReturn === 1) {
              await sendReminderEmail(
                user.email,
                "The return date is tomorrow.",
                order,
              );
            } else if (daysUntilReturn === 0) {
              await sendReminderEmail(
                user.email,
                "Today is the return date.",
                order,
              );
            } else if (daysUntilReturn < 0) {
              const daysLate = Math.abs(daysUntilReturn);
              await sendReminderEmail(
                user.email,
                `You are ${daysLate} days late to return the product.`,
                order,
              );
            }
          }
        });
      }
    });
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
