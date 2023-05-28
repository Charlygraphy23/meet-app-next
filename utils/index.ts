import { StreamType } from "hooks/usePeer";

export const getLocalMediaStream = async ({
	video = false,
	audio = false,
}: {
	video?: boolean;
	audio?: boolean;
}) => {
	let localStream: MediaStream;
	try {
		localStream = await navigator.mediaDevices.getUserMedia({
			video,
			audio,
		});
		return localStream;
	} catch (error: any) {
		console.error(error);
		throw new Error(error.message);
	}
};


export const getLocalShareScreen = async () => {
	let localStream: MediaStream;
	try {
		localStream = await navigator.mediaDevices.getDisplayMedia({
			video: {
				// @ts-ignore
				displaySurface : "window",
			},
			audio: false
		});
		return localStream;
	} catch (error: any) {
		console.error(error);
		throw new Error(error.message);
	}
};

export const toggleVideoCamera = async (
	VideoStream: MediaStream,
	isVideo: boolean,
	replacePeer?: (stream: MediaStream , type: StreamType) => void
) => {
		console.log("Inside toggleVideoCamera" , {video : VideoStream.getVideoTracks() , isVideo})

	if (!isVideo) {
		VideoStream.getVideoTracks()[0].enabled = isVideo;
		VideoStream.getVideoTracks()[0].stop();
		if(replacePeer)
		replacePeer(VideoStream , VideoStream.getVideoTracks()[0].kind as StreamType)
	} 
	else {
		const newStream = await getLocalMediaStream({ video: true });
		VideoStream.removeTrack(VideoStream.getVideoTracks()[0]);
		VideoStream?.addTrack(newStream.getVideoTracks()[0]);
		if(replacePeer)
		replacePeer(VideoStream , newStream.getVideoTracks()[0].kind as StreamType)
	}


	return VideoStream;
};

export const toggleMice = async (
	Stream: MediaStream,
	isMute: boolean,
	replacePeer?: (stream: MediaStream , type: StreamType) => void
) => {
		console.log("Inside toggleMic" , {audio : Stream.getAudioTracks() , isMute})

	if (isMute) {
		Stream.getAudioTracks()[0].enabled = !isMute;
		Stream.getAudioTracks()[0].stop()
		if(replacePeer)
		replacePeer(Stream , Stream.getAudioTracks()[0].kind as StreamType)
	} 
	else {
		const newStream = await getLocalMediaStream({ audio: true });
		Stream.removeTrack(Stream.getAudioTracks()[0]);
		Stream?.addTrack(newStream.getAudioTracks()[0]);
		if(replacePeer)
		replacePeer(Stream , newStream.getAudioTracks()[0].kind as StreamType)
	}


	return Stream;
};

export const handleAbortController = () => {
	const controller = new AbortController();
	const signal = controller.signal;

	return {
		abort: () => controller.abort(),
		signal,
	};
};
