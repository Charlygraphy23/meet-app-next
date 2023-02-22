import { UserStream } from "interface";
import React, {
	useEffect,
	useRef,
} from "react";
import Video from "./components/video";

type Props = {
	stream: UserStream;
	isMyStream?: boolean;
	controls?: boolean;
	style?: React.CSSProperties;
	userId?: string;
	updateStream: (stream : UserStream) => void
};

const VideoStream = ({ stream, style, ...rest }: Props) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const ref = useRef();

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
		if (!stream) return;

		if (!videoRef.current) return;

		if (videoRef.current.srcObject === stream.stream) return;

		videoRef.current.srcObject = stream.stream;
	}, [stream]);
	return (
		<div className='videoStream' style={style}>

			<Video ref={videoRef} stream={stream} {...rest} />
		</div>
	);
};

export default VideoStream;
