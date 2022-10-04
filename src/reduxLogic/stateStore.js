import { configureStore } from "@reduxjs/toolkit";
import deviceManagerReducer from "./deviceManagerReducer";
import { bluetoothMiddleware } from "./middleware/bluetoothMiddleware";

export const store = configureStore({
    reducer: {
        deviceManager: deviceManagerReducer,
    },
    middleware: [bluetoothMiddleware],
});

