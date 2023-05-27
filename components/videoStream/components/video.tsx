import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import Button from "components/button";
import classNames from "classnames";
import Emitter from "utils/emitter";
import { useSelector } from "react-redux";
import { StoreType } from "store";
import Image from "next/image";
import { RefHandlerType, UserStream } from "interface";
import { toggleMice, toggleVideoCamera } from "utils";
import { useSession } from "next-auth/react";
import { StreamType } from "hooks/usePeer";

type Props = {
	isMyStream?: boolean;
	controls?: boolean;
	stream: UserStream;
	updateStream: (stream: UserStream) => void,
	replacePeer: (stream: MediaStream, type: StreamType) => void
};

type Payload = {
	userId: string,
	video?: boolean,
	mute?: boolean,
}


const Video = (
	{ isMyStream, controls = false, stream, updateStream, replacePeer }: Props,
	ref: React.Ref<RefHandlerType>
) => {
	const { socket, ownId } = useSelector((state: StoreType) => state.SocketReducer);
	const videoRef = useRef() as React.MutableRefObject<HTMLVideoElement>;
	const { data: session } = useSession()
	const randomColor = useCallback(() => {
		const x = Math.floor(Math.random() * 256);
		const y = Math.floor(Math.random() * 256);
		const z = Math.floor(Math.random() * 256);
		return "rgb(" + x + "," + y + "," + z + ")";
	}, [])
	const userBackgroundColor = useMemo(() => randomColor(), [randomColor])


	const sliceName = useCallback(() => {
		return stream?.name?.charAt(0)?.toUpperCase() || ""
	}, [stream])


	const handleCameraToggle = useCallback(
		async (payload?: Payload, socketEvent?: boolean) => {
			const localStream = stream.stream
			const isVideo = payload?.video ?? !stream.video

			if(socketEvent){
				const _videoStream = await toggleVideoCamera(localStream, isVideo)

				const _stream = {
					...stream,
					video: isVideo,
					stream: _videoStream
				}
				return updateStream(_stream)
			}

			// else means local stream
			
			const _videoStream = await toggleVideoCamera(localStream, isVideo, replacePeer)

			if (socket && socket.connected) {
				if (payload)
					socket.emit("toggle-video-emit", { isVideo: _videoStream.getVideoTracks()[0].enabled, id: payload.userId })

				const _stream = {
					...stream,
					video: isVideo,
					stream: _videoStream
				}
				return updateStream(_stream)
			}

		},
		[replacePeer, socket, stream, updateStream]
	);

	const handleMicToggle = useCallback(async (payload?: Payload, socketEvent?: boolean) => {
		const localStream = stream.stream
		const isMute =  payload?.mute ?? !stream.mute

		if(socketEvent){
			const _audioStream = await toggleMice(localStream, isMute)
			console.log({
				tracks : _audioStream.getAudioTracks(),
				muted: !_audioStream.getAudioTracks()[0].enabled
			})
			const _stream = {
				...stream,
				stream: _audioStream,
				mute : isMute
			}
			return updateStream(_stream)
		}

		// else means local stream
		
		const _audioStream = await toggleMice(localStream, isMute, replacePeer)

		if (socket && socket.connected) {
			
			if (payload)
				socket.emit("toggle-audio-emit", { isMute: !_audioStream.getAudioTracks()[0].enabled, id: payload.userId })

			const _stream = {
				...stream,
				stream: _audioStream,
				mute : isMute
			}
			return updateStream(_stream)
		}


		// localStream.getAudioTracks()[0].enabled = !isMute;
		// const _stream = {
		// 	...stream,
		// 	mute: isMute,
		// 	stream: localStream
		// }

		// return updateStream(_stream)

		// if (socket && socket.connected) {
		// 	socket.emit("toggle-audio-emit", !isMute)
		// }
	}, [replacePeer, socket, stream, updateStream])

	const handleToolClick = useCallback(
		async (type: string, payload?: Payload, socketEvent?: boolean) => {
			if (["mic"].includes(type)) {
				await handleMicToggle(payload, socketEvent)
			}

			if (["video"].includes(type)) {

				await handleCameraToggle(payload, socketEvent)
			}

		},
		[handleCameraToggle, handleMicToggle]
	);


	useImperativeHandle(ref, () => ({
		toggleEvent: (type: "mic" | "video", payload: any) => {
			if (stream.userId === payload.userId) {
				handleToolClick(type, payload, true)
			}
		},
		updateVideoStream: () => {
			if (!videoRef.current) return;
			if (videoRef.current.srcObject === stream.stream) return;
			videoRef.current.srcObject = stream.stream
		}
	}), [handleToolClick, stream]);

	useEffect(() => {
		const handleToggle = ({ type, payload }: { type: "video" | "mic" | "", payload: Payload }) => {
			if (stream.userId === payload.userId) handleToolClick(type, payload);
		};
		Emitter.on("TOGGLE-TOOL", handleToggle);

		return () => {
			Emitter.off("TOGGLE-TOOL", handleToggle);

		};
	}, [handleToolClick, stream?.userId]);

	return (
		<div className='videoStream__wrapper'>


			{/* <h1 style={{backgroundColor : "yellow" , color : "black"}}>
				{
					JSON.stringify(stream)
				}
			</h1> */}
			<video ref={videoRef} autoPlay muted={isMyStream}></video>
			{stream.loading && <h2 className="loadingText">{stream.loadingText}</h2>}

			{!controls && session && !stream.video && <div className="userName" style={{ backgroundColor: userBackgroundColor }}>
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
