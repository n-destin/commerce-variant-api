import mongoose from 'mongoose';

const salesByProductSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  totalSales: Number,
  unitsSold: Number,
});

const salesTrendSchema = new mongoose.Schema({
  date: Date,
  totalSales: Number,
  totalOrders: Number,
});

const customerPurchaseBehaviorSchema = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  totalPurchases: Number,
  favoriteProducts: [mongoose.Schema.Types.ObjectId], // Array of product IDs
});

const salesAnalyticsSchema = new mongoose.Schema({
  shopId: mongoose.Schema.Types.ObjectId,
  totalRevenue: Number,
  totalOrders: Number,
  salesByProduct: [salesByProductSchema],
  salesTrends: [salesTrendSchema],
  customerPurchaseBehavior: [customerPurchaseBehaviorSchema],
  // Additional fields can be added as needed
});

const SalesAnalytics = mongoose.model('SalesAnalytics', salesAnalyticsSchema);
export default SalesAnalytics;
