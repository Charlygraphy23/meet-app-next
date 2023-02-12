import { createReducer } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { addMyId, getSocket } from "./../actions/socket.actions";

type StateType = {
	socket: Socket | null;
	ownId: string;
};

const initialState: StateType = {
	socket: null,
	ownId: "",
};

export const SocketReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(getSocket, (state, action) => {
			state.socket = action.payload;
			return state;
		})
		.addCase(addMyId, (state, action) => {
			state.ownId = action.payload;
			return state;
		});
});
