import mongoose, { Schema } from "mongoose";

export interface IOrder {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;

  items: {
    grocery: mongoose.Types.ObjectId;
    name: string;
    price: number;
    unit: string;
    image: string;
    quantity: number;
  }[];

  isPaid: boolean
  totalAmount: number;
  paymentMethod: "cod" | "online";

  address: {
    fullName: string;
    mobile: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  assignment?: mongoose.Types.ObjectId
  assignedDeliveryBoy?: mongoose.Types.ObjectId
  status: "pending" | "out_for_delivery" | "delivered";

  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    items: [
      {
        grocery: {
          type: Schema.Types.ObjectId,
          ref: "Grocery",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        unit: { type: String, required: true },
        image: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],


    totalAmount: { type: Number, required: true },

    paymentMethod: { type: String, enum: ["cod", "online"], required: true },
    isPaid: {
      type: Boolean,
      default: false
    },

    address: {
      fullName: { type: String, required: true },
      mobile: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      fullAddress: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAssignment",
      default:null
    }
    ,


    assignedDeliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
    ,
    status: {
      type: String,
      enum: ["pending", "out_for_delivery", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
