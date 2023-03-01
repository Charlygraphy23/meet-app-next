export interface UserStream {
	stream: MediaStream;
	userId: string;
	video : boolean;
	mute : boolean;
	loading?: boolean;
	loadingText?: string
}


export interface RefHandlerType {
	toggleEvent: (type: "mic" | "video" , payload : any) => any,
	updateVideoStream: () => void
}