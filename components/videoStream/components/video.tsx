import React, { forwardRef, useCallback, useEffect, useRef } from "react";
import Button from "components/button";
import classNames from "classnames";
import Emitter from "utils/emitter";
import { useSelector } from "react-redux";
import { StoreType } from "store";
import Image from "next/image";
import { UserStream } from "interface";

type Props = {
	isMyStream?: boolean;
	controls?: boolean;
	stream: UserStream;
	updateStream: (stream : UserStream) => void
};

const Video = (
	{ isMyStream, controls = false , stream , updateStream}: Props,
	ref: React.Ref<HTMLVideoElement>
) => {

	const { socket } = useSelector((state: StoreType) => state.SocketReducer);

	const handleCameraToggle = useCallback(
		async (localStream: MediaStream , id?: string) => {

			if(id){
				if(id === stream.userId){
					localStream.getVideoTracks()[0].enabled = !stream.video;

					const _stream = {
						...stream,
						video: !stream.video,
						stream : localStream,
					}

					return updateStream(_stream)

				}

				return updateStream(stream)

			}

			localStream.getVideoTracks()[0].enabled = !stream.video;
			const _stream = {
				...stream,
				video: !stream.video,
				stream : localStream,
			}
			return updateStream(_stream)

		},
		[stream, updateStream]
	);

	const handleMicToggle = useCallback(async (localStream: MediaStream , id?: string) => {
		console.log("Demo" , localStream.getAudioTracks())
		if(id){
			if(id === stream.userId){
				localStream.getAudioTracks()[0].enabled = stream.mute;
				const _stream = {
					...stream,
					mute: !stream.mute,
					stream : localStream
				}

				return updateStream(_stream)

			}

			return updateStream(stream)

		}
		
		localStream.getAudioTracks()[0].enabled = stream.mute;

		const _stream = {
			...stream,
			mute: !stream.mute,
			stream : localStream
		}
		return updateStream(_stream)
	} , [stream, updateStream])

	const handleToolClick = useCallback(
		async (type: string , id?:string) => {
			console.log("TYpe", type , id , stream.userId);
			//@ts-expect-error
			const localStream: MediaStream = ref.current.srcObject;

			if (["mic"].includes(type)) {
					await handleMicToggle(localStream , id)
			}

			if (["video"].includes(type)) {
				await handleCameraToggle(localStream , id)
			}

		},
		[handleCameraToggle, handleMicToggle, ref, stream.userId]
	);

	useEffect(() => {
		const handleToggle = ({type , userID} : {type: "video" | "mic" | "" , userID : string}) => {
			console.log("TRriggering Twi Times")
			handleToolClick(type , userID);
		};
		Emitter.on("TOGGLE-TOOL", handleToggle);

		return () => {
			Emitter.off("TOGGLE-TOOL", handleToggle);
			Emitter.clean("TOGGLE-TOOL", handleToggle);

		};
	}, [handleToolClick]);

	useEffect(() => {
		if (!socket) return;
		if (!socket.connected) return;

		socket.on("toggle-audio", (payload) => {
			console.log("Toggle emit Audio", payload, stream.userId)
			if (stream.userId === payload.userId) {
				handleToolClick("mic" , payload.userId)
			}
		});

		socket.on("toggle-video", (payload) => {
			console.log("Toggle emit video", payload, stream.userId)
			if (stream.userId === payload.userId) {
				handleToolClick("video" , payload.userId)
			}
		});


		return () => {
			if (!socket) return;
			if (!socket.connected) return;
			socket.off("toggle-audio");
			socket.off("toggle-video");
		};

	}, [handleToolClick, socket, stream, updateStream])

	return (
		<div className='videoStream__wrapper'>
			
{/* 
			<h1 style={{backgroundColor : "yellow" , color : "black"}}>
				{stream.userId}
			</h1> */}
			<video ref={ref} autoPlay muted={isMyStream}></video>
			{stream.loading && <h2 className="loadingText">{stream.loadingText}</h2>}

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

			{!controls && stream.mute &&  <div className="mute__icon">
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
