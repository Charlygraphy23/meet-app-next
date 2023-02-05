import { createReducer } from "@reduxjs/toolkit";
import { getSocket } from "./../actions/socket.actions";

const initialState = {
	socket: null,
};

export const SocketReducer = createReducer(initialState, (builder) => {
	builder.addCase(getSocket, (state, action) => {
		state.socket = action.payload;
		return state;
	});
});
