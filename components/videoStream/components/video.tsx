import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import Button from "components/button";
import classNames from "classnames";
import Emitter from "utils/emitter";
import { useSelector } from "react-redux";
import { StoreType } from "store";
import Image from "next/image";
import { RefHandlerType, UserStream } from "interface";
import { toggleVideoCamera } from "utils";
import Peer from "peerjs";
import { useSession } from "next-auth/react";

type Props = {
	isMyStream?: boolean;
	controls?: boolean;
	stream: UserStream;
	updateStream: (stream: UserStream) => void,
	peer?: Peer
};


const Video = (
	{ isMyStream, controls = false, stream, updateStream , peer}: Props,
	ref: React.Ref<RefHandlerType>
) => {
	const { ownId } = useSelector((state: StoreType) => state.SocketReducer);
	const videoRef = useRef() as React.MutableRefObject<HTMLVideoElement>;
	const {data: session} = useSession()
	const randomColor = useCallback(() => {
		const x = Math.floor(Math.random() * 256);
		const y = Math.floor(Math.random() * 256);
		const z = Math.floor(Math.random() * 256);
		return "rgb(" + x + "," + y + "," + z + ")";
	} , [])
	const userBackgroundColor = useMemo(() => randomColor() , [randomColor])


	const sliceName = useCallback(() => {
		return stream?.name?.charAt(0)?.toUpperCase() || ""
	} , [stream])

	
	const handleCameraToggle = useCallback(
		async (id?: string, otherUser: boolean = false) => {
			const localStream = stream.stream
			const isVideo = !stream.video

			localStream.getVideoTracks()[0].enabled = isVideo;

				const _stream = {
					...stream,
					video: localStream.getVideoTracks()[0].enabled,
					stream: localStream,
				}

				return updateStream(_stream)

		},
		[stream, updateStream]
	);

	const handleMicToggle = useCallback(async () => {
		const localStream = stream.stream
		const isMute = !stream.mute

		localStream.getAudioTracks()[0].enabled = !isMute;
		const _stream = {
			...stream,
			mute: isMute,
			stream: localStream
		}

		return updateStream(_stream)
	}, [stream, updateStream])

	const handleToolClick = useCallback(
		async (type: string, id?: string, otherUser?: boolean) => {
			if (["mic"].includes(type)) {
				await handleMicToggle()
			}

			if (["video"].includes(type)) {
				await handleCameraToggle(id, otherUser)
			}

		},
		[handleCameraToggle, handleMicToggle]
	);


	useImperativeHandle(ref, () => ({
		toggleEvent: (type: "mic" | "video" , payload: any) => {
			if (stream.userId === payload.userId) {
				handleToolClick(type, payload.userId, true)
			}
		},
		updateVideoStream: () => {
			if (!videoRef.current) return;
			if (videoRef.current.srcObject === stream.stream) return;
			videoRef.current.srcObject = stream.stream
		}
	}), [handleToolClick, stream]);

	useEffect(() => {
		const handleToggle = ({ type, userID }: { type: "video" | "mic" | "", userID: string }) => {
			if (stream.userId === userID) handleToolClick(type, userID);
		};
		Emitter.on("TOGGLE-TOOL", handleToggle);

		return () => {
			Emitter.off("TOGGLE-TOOL", handleToggle);
			// Emitter.clean("TOGGLE-TOOL", handleToggle);

		};
	}, [handleToolClick, stream?.userId]);

	return (
		<div className='videoStream__wrapper'>

			{/* 
			<h1 style={{backgroundColor : "yellow" , color : "black"}}>
				{stream.userId}
			</h1> */}
			<video ref={videoRef} autoPlay muted={isMyStream}></video>
			{stream.loading && <h2 className="loadingText">{stream.loadingText}</h2>}

			{!controls && session && !stream.video && <div className="userName" style={{backgroundColor : userBackgroundColor}}>
				<span>{sliceName()}</span>
			</div>}

			{controls && (
				<div className='tools'>
					<Button
						className={classNames("", {
							error: stream.mute,
						})}
						onClick={() => handleToolClick("mic")}>
						<i className={`bi bi-mic${stream.mute ? "-mute" : ""}`}></i>
					</Button>
					<Button
						className={classNames("", {
							error: !stream.video,
						})}
						onClick={() => handleToolClick("video")}>
						<i
							className={`bi bi-camera-video${!stream.video ? "-off" : ""
								}`}></i>
					</Button>

				</div>
			)}

			{!controls && stream.mute && <div className="mute__icon">
				<Image
					src="https://img.icons8.com/external-royyan-wijaya-detailed-outline-royyan-wijaya/24/null/external-mute-audio-and-video-royyan-wijaya-detailed-outline-royyan-wijaya.png"
					alt="mute_image"
					width={20}
					height={20}
				/>
			</div>}
		</div>
	);
};

export default forwardRef(Video);
