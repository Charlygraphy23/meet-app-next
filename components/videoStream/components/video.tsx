import React, { forwardRef, useCallback, useEffect } from "react";
import Button from "components/button";
import classNames from "classnames";
import { useState } from "react";
import { getLocalMediaStream, toggleVideoCamera } from "utils/index";

type Props = {
	myStream?: boolean;
};

const Video = ({ myStream }: Props, ref: React.Ref<HTMLVideoElement>) => {
	const [videoState, setVideoState] = useState({
		mute: false,
		video: true,
	});

	const handleCameraToggle = useCallback(
		async (localStream: MediaStream, video: typeof videoState.video) => {
			const stream = await toggleVideoCamera(localStream, video);

			console.log(stream.getVideoTracks());
		},
		[videoState]
	);

	const handleToolClick = (type: string) => {
		// @ts-expect-error
		const localStream: MediaStream = ref.current.srcObject;
		let newVideoState = {
			...videoState,
		};
		// TODO: if i mutes video then video get muted in other device insteed mine
		// same for other devices

		switch (type) {
			case "mic":
				newVideoState.mute = !videoState.mute;
				break;
			case "video":
				newVideoState.video = !videoState.video;
				handleCameraToggle(localStream, newVideoState.video);
				break;

			default:
				newVideoState.video = !videoState.video;
				break;
		}

		setVideoState(newVideoState);
	};

	return (
		<div className='videoStream__wrapper'>
			<video ref={ref} autoPlay muted={myStream}></video>

			<div className='tools'>
				<Button
					className={classNames("", {
						error: videoState.mute,
					})}
					onClick={() => handleToolClick("mic")}>
					<i className={`bi bi-mic${videoState.mute ? "-mute" : ""}`}></i>
				</Button>
				<Button
					className={classNames("", {
						error: !videoState.video,
					})}
					onClick={() => handleToolClick("video")}>
					<i
						className={`bi bi-camera-video${
							!videoState.video ? "-off" : ""
						}`}></i>
				</Button>
			</div>
		</div>
	);
};

export default forwardRef(Video);
