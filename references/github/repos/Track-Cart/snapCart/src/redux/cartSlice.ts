import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IGrocery {
  _id?: string;
  name: string;
  category: string;
  price: string;
  unit: string;
  quantity: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ICartSlice {
  cartData: IGrocery[];
  subTotal: number;
  deliveryFee: number;
  finalTotal: number;
}

const TAX_RATE = 0.05;

const initialState: ICartSlice = {
  cartData: [],
  subTotal: 0,
  deliveryFee: 40,
  finalTotal: 40,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<IGrocery>) => {
      const existing = state.cartData.find(
        (item) => item._id === action.payload._id
      );

      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.cartData.push(action.payload);
      }
      cartSlice.caseReducers.calculateTotals(state);
    },

    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cartData.find((i) => i._id === action.payload);
      if (item) item.quantity += 1;
      cartSlice.caseReducers.calculateTotals(state);
    },

    decrementQuantity: (state, action: PayloadAction<string>) => {
      const itemIndex = state.cartData.findIndex(
        (i) => i._id === action.payload
      );

      if (itemIndex !== -1) {
        if (state.cartData[itemIndex].quantity > 1) {
          state.cartData[itemIndex].quantity -= 1;
        } else {
          state.cartData.splice(itemIndex, 1);
        }
      }

      cartSlice.caseReducers.calculateTotals(state); // ✅ added
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartData = state.cartData.filter(
        (item) => item._id !== action.payload
      );
      cartSlice.caseReducers.calculateTotals(state);
    },

    calculateTotals: (state) => {
      state.subTotal = state.cartData.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      );

      state.deliveryFee = state.subTotal >= 100 ? 40 : 0;

      const tax = state.subTotal * TAX_RATE;

      state.finalTotal = state.subTotal + tax + state.deliveryFee;
    },
  },
});

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
