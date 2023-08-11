import { RefHandlerType, UserStream } from "interface";
import Peer from "peerjs";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { StoreType } from "store";
import Video from "./components/video";
import { StreamType } from "hooks/usePeer";

type Props = {
	stream: UserStream;
	isMyStream?: boolean;
	controls?: boolean;
	style?: React.CSSProperties;
	userId?: string;
	updateStream: (stream: UserStream) => void;
	peer?: Peer;
	hasScreenShared: boolean;
	replacePeer: (stream: MediaStream, type: StreamType) => void;
};

const VideoStream = ({ stream, style, hasScreenShared, ...rest }: Props) => {
	const videoRef = useRef() as React.MutableRefObject<RefHandlerType>;
	const ref = useRef();
	const { socket } = useSelector((state: StoreType) => state.SocketReducer);

	// useEffect(() => {
	// 	return () => {
	// 		if (!stream) return;

	// 		stream.getTracks().forEach((track) => {
	// 			track.stop();
	// 			track.enabled = false;
	// 		});
	// 	};
	// }, [stream]);

	useEffect(() => {
		if (!socket) return;
		if (!socket.connected) return;

		socket.on("toggle-audio", (payload) => {
			videoRef.current?.toggleEvent("mic", payload);
		});

		socket.on("toggle-video", (payload) => {
			videoRef.current?.toggleEvent("video", payload);
		});

		return () => {
			if (!socket) return;
			if (!socket.connected) return;
			socket.off("toggle-audio");
			socket.off("toggle-video");
		};
	}, [socket]);

	useEffect(() => {
		if (!stream) return;
		if (!videoRef.current) return;
		videoRef.current.updateVideoStream();
	}, [stream]);
	return (
		<div className='videoStream' style={style}>
			<Video ref={videoRef} stream={stream} {...rest} />
		</div>
	);
};

export default VideoStream;
