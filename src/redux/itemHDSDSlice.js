import { createSlice } from '@reduxjs/toolkit';

export const ItemHDSDSlice = createSlice({
    name: 'itemHDSD',
    initialState: {
        data: []
    },
    reducers: {
        insert: (state, action) => {
            state.data = [...state.data, action.payload];
        },
    },
});

export const { insert } = ItemHDSDSlice.actions;
export default ItemHDSDSlice.reducer;
