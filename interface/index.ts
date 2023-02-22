export interface UserStream {
	stream: MediaStream;
	userId: string;
	video : boolean;
	mute : boolean;
	loading?: boolean;
	loadingText?: string
}
