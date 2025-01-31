import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

export interface eventsControllerSlice {
  value: [];
}

const initialState: eventsControllerSlice = {
  value: [],
};

export const eventsControllerSlice = createSlice({
  name: "controller",
  initialState,
  reducers: {
    save: (state, action: PayloadAction<[]>) => {
      state.value = action.payload;
    },
    load: (state) => {
      return state;
    },
  },
});
