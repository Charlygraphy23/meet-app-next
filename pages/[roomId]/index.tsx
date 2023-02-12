import React, { useCallback, useEffect, useRef, useState } from "react";
import HomeComponent from "components/home";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { getSocket } from "store/actions";
import CallLayout from "components/call/layout";
import { handleAbortController } from "utils";
import usePeer from "hooks/usePeer";

const HomePage = () => {
	const ref = useRef();
	const dispatch = useDispatch();
	const [showCallView, setShowCallView] = useState(false);
	const {id} = usePeer()

	const handleSocket = useCallback(async () => {
		const abortController = handleAbortController()
		await fetch("/api/socket" , {signal : abortController.signal});

		const socket = io();

		socket.on("connect", () => {
			console.log(socket);
			dispatch(getSocket(socket));
		});

		socket.on("disconnect", () => {
			console.log("Socket Disconnected");
		});

		return ()=> {
			abortController.abort();

			if(socket.active){
				socket.disconnect();
				socket.off()
			}
		};
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
				<CallLayout />
			) : (
				<HomeComponent switchView={handleViewSwitch} />
			)}
		</>
	);
};

export default HomePage;
