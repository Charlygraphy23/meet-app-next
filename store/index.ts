import { configureStore } from "@reduxjs/toolkit";
import Reducer from "./reducers";

const store = configureStore({
	reducer: Reducer,
	devTools: true,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({ serializableCheck: false }),
});

export type StoreType = ReturnType<typeof store.getState>;

export default store;
