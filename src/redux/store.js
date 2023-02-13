import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"
import ItemHDSDSlice from "./itemHDSDSlice"

export default configureStore(
	{
		reducer: {
			user: userReducer,
			nhomquyen: ItemHDSDSlice,
		}
	}
)