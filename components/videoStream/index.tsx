import React, {
	startTransition,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { getLocalMediaStream } from "utils";
import Video from "./components/video";

type Props = {
	mediaStream?: MediaStream;
	myStream?: boolean;
};

const VideoStream = ({ mediaStream, myStream }: Props) => {
	const [stream, setStream] = useState<MediaStream | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const ref = useRef();

	const getVideo = useCallback(async () => {
		console.log("Get Video");
		try {
			const _stream = await getLocalMediaStream({ video: true, audio: true });
			setStream(_stream);
		} catch (err) {
			console.error(err);
		}
	}, []);

	useEffect(() => {
		if (ref.current) return;
		// @ts-expect-error
		ref.current = true;

		if (mediaStream) return setStream(mediaStream);

		getVideo();
	}, [getVideo, mediaStream]);

	useEffect(() => {
		return () => {
			if (!stream) return;

			stream.getTracks().forEach((track) => {
				track.stop();
				track.enabled = false;
			});
		};
	}, [stream]);

	useEffect(() => {
		if (!stream) return;

		if (!videoRef.current) return;

		if (videoRef.current.srcObject) return;
		console.log(stream);
		videoRef.current.srcObject = stream;
	}, [stream]);
	return (
		<div className='videoStream'>
			<Video ref={videoRef} myStream={myStream} />
		</div>
	);
};

export default VideoStream;
