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
		console.log(error);
		throw new Error(error.message);
	}
};

export const toggleVideoCamera = async (
	VideoStream: MediaStream,
	isVideo: boolean
) => {
	if (!isVideo) {
		VideoStream.getVideoTracks()[0].enabled = isVideo;
		VideoStream.getVideoTracks()[0].stop();
		VideoStream.removeTrack(VideoStream.getVideoTracks()[0]);
	} else {
		const newStream = await getLocalMediaStream({ video: true });
		VideoStream.addTrack(newStream.getVideoTracks()[0]);
	}

	return VideoStream;
};
