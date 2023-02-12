import React, { useCallback, useEffect, useRef, useState } from "react";
import HomeComponent from "components/home";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { addMyId, getSocket } from "store/actions";
import CallLayout from "components/call/layout";
import { getLocalMediaStream, handleAbortController } from "utils";
import usePeer from "hooks/usePeer";
import { StoreType } from "store";
import { useRouter } from "next/router";
import { UserStream } from "interface";

const HomePage = () => {
	const ref = useRef();
	const dispatch = useDispatch();
	const [showCallView, setShowCallView] = useState(false);
	const { id, peer } = usePeer();
	const { socket } = useSelector((state: StoreType) => state.SocketReducer);
	const { query } = useRouter();
	const roomID = query.roomId;

	const handleSocket = useCallback(async () => {
		const abortController = handleAbortController();
		await fetch("/api/socket", { signal: abortController.signal });

		const socket = io();

		socket.on("connect", () => {
			console.log(socket);
			dispatch(getSocket(socket));
		});

		socket.on("disconnect", () => {
			console.log("Socket Disconnected");
		});

		return () => {
			abortController.abort();

			if (socket.connected) {
				socket.disconnect();
				socket.off();
			}
		};
	}, [dispatch]);

	const handleViewSwitch = useCallback(async () => {
		if (!socket?.connected) return;
		if (!id) return;
		console.log("HANDE");
		socket.emit("join-room", {
			room: roomID,
			userId: id,
		});
		setShowCallView(!showCallView);
	}, [id, roomID, showCallView, socket]);

	useEffect(() => {
		if (ref.current) return;

		// @ts-expect-error
		ref.current = true;

		handleSocket();
	}, [handleSocket]);

	useEffect(() => {
		if (!id) return;

		dispatch(addMyId(id));
	}, [id, dispatch]);

	return (
		<>
			{showCallView ? (
				<CallLayout peer={peer} />
			) : (
				<HomeComponent switchView={handleViewSwitch} />
			)}
		</>
	);
};

export default HomePage;
