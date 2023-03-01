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
	const [stream, setStream] = useState<UserStream>({
		video : false,
		mute : true
	} as UserStream);

	const getVideo = useCallback(async (id: string) => {
		try {
			const _stream = await getLocalMediaStream({ video: true, audio: true });
			
			setStream({
				stream : _stream,
				userId : id,
				video : _stream.active,
				mute : !_stream.getAudioTracks()[0].enabled,
				loading : false,
				loadingText : ""
			});
		} catch (err) {
			console.error(err);
		}
	}, []);


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
				socket.off("connect");
				socket.off("disconnect");
			}
		};
	}, [dispatch]);

	const handleViewSwitch = useCallback(async () => {
		if (!socket?.connected) return;
		if (!id) return;
		socket.emit("join-room", {
			room: roomID,
			userId: id,
		});
		setShowCallView(!showCallView);
	}, [id, roomID, showCallView, socket]);

	const updateStream = useCallback((stream : UserStream) => {
		setStream(stream)
	} , [])

	useEffect(() => {
		if (ref.current) return;

		// @ts-expect-error
		ref.current = true;
		setStream(prevState => ({...prevState, loading : true , loadingText : "Please wait..."}))
		handleSocket();
	}, [handleSocket]);

	useEffect(() => {
		if (!id) return;

		dispatch(addMyId(id));
		setStream(prevState => ({...prevState, loading : true , loadingText : "Connecting..."}))
		getVideo(id);
	}, [id, dispatch, getVideo]);


	return (
		<>
			{showCallView ? (
				<CallLayout peer={peer} stream={stream} update={updateStream}/>
			) : (
				<HomeComponent switchView={handleViewSwitch} stream={stream} updateStream={updateStream}/>
			)}
		</>
	);
};

export default HomePage;