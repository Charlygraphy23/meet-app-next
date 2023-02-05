import React, { useCallback, useEffect, useRef, useState } from "react";
import HomeComponent from "components/home";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { getSocket } from "store/actions";
import CallComponent from "components/call";

const HomePage = () => {
	const ref = useRef();
	const dispatch = useDispatch();
	const [showCallView, setShowCallView] = useState(false);

	const handleSocket = useCallback(async () => {
		await fetch("/api/socket");

		const socket = io();
		console.log(socket);

		socket.on("connect", () => {
			console.log(socket);
			dispatch(getSocket(socket));
		});

		socket.on("disconnect", () => {
			console.log("Socket Disconnected");
		});

		return null;
	}, [dispatch]);

	useEffect(() => {
		if (ref.current) return;

		// @ts-expect-error
		ref.current = true;

		handleSocket();
	}, [handleSocket]);

	const handleViewSwitch = useCallback(async () => {
		setShowCallView(!showCallView);
	}, [showCallView]);

	return (
		<>
			{showCallView ? (
				<CallComponent />
			) : (
				<HomeComponent switchView={handleViewSwitch} />
			)}
		</>
	);
};

export default HomePage;
