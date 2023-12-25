import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  fistname: String,
  email: String,
  phone: String,
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  isEmailSubscriber: Boolean,
  hasAbandonedCheckout: Boolean,
});

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
