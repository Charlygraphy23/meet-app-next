import React, { forwardRef, useCallback, useEffect, useRef } from "react";
import Button from "components/button";
import classNames from "classnames";
import { useState } from "react";
import { getLocalMediaStream, toggleVideoCamera } from "utils/index";
import Emitter from "utils/emitter";

type Props = {
	myStream?: boolean;
	controls?: boolean;
	triggerType?: "video" | "mic" | "";
};

const Video = (
	{ myStream, controls = false, triggerType }: Props,
	ref: React.Ref<HTMLVideoElement>
) => {
	const [videoState, setVideoState] = useState({
		mute: false,
		video: true,
	});
	const triggerRef = useRef();

	const handleCameraToggle = useCallback(
		async (localStream: MediaStream, video: typeof videoState.video) => {
			const stream = await toggleVideoCamera(localStream, video);

			// console.log(stream.getVideoTracks());
		},
		[videoState]
	);

	const handleToolClick = useCallback(
		(type: string) => {
			console.log("TYpe", type);
			setVideoState((prevState) => {
				// @ts-expect-error
				const localStream: MediaStream = ref.current.srcObject;
				let newVideoState = {
					...prevState,
				};
				// TODO: if i mutes video then video get muted in other device insteed mine
				// same for other devices

				switch (type) {
					case "mic":
						newVideoState.mute = !prevState.mute;
						break;
					case "video":
						newVideoState.video = !prevState.video;
						handleCameraToggle(localStream, newVideoState.video);
						break;

					case "":
						break;

					default:
						newVideoState.video = !prevState.video;
						break;
				}
				return newVideoState;
			});
		},
		[handleCameraToggle, ref]
	);

	useEffect(() => {
		const handleToggle = (type: "video" | "mic" | "") => {
			handleToolClick(type);
		};
		Emitter.on("TOGGLE-TOOL", handleToggle);

		return () => {
			Emitter.off("TOGGLE-TOOL", handleToggle);
		};
	}, [handleToolClick]);

	return (
		<div className='videoStream__wrapper'>
			<video ref={ref} autoPlay muted={myStream}></video>

			{controls && (
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
			)}
		</div>
	);
};

export default forwardRef(Video);
