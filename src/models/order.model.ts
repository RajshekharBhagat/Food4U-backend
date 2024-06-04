import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  deliveryDetails: {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      requried: true,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  cartItem: [
    {
      menuId: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      }
    },
  ],
  totalAmount: {
    type: Number,
    min: 0,
  },
  status: {
    type: String,
    enum: ['placed','paid','inProgress','outForDelivery','delivered'],
    default: 'placed',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  }
});

const Order = mongoose.model('Order',orderSchema);
export default Order;
