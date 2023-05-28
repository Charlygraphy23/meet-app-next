import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const socketEvents = (
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
	socket.on("join-room", (payload: any) => {
		const { room, userId , name , video , mute , screenShare} = payload;
		console.log("User Joined ", room);
		socket.join(room);
		socket.broadcast.to(room).emit("joined", { userId , name , video , mute , screenShare});
		socket.on("disconnect", () => {
			console.log("Socket Disconnected", socket.id);
			socket.broadcast.to(room).emit("delete-video", userId);
		});

		socket.on("toggle-audio-emit", ({isMute , id}: {isMute: boolean , id: string}) => {
			socket.broadcast.to(room).emit("toggle-audio", {
				mute : isMute,
				userId : id
			});
		});

		socket.on("toggle-video-emit", ({isVideo , id}: {isVideo: boolean , id: string}) => {
			socket.broadcast.to(room).emit("toggle-video", {
				video : isVideo,
				userId : id
			});
		});

		socket.on("toggle-screen-share", ({id}: { id: string}) => {
			socket.broadcast.to(room).emit("toggle-screen", {
				userId : id
			});
		});

		socket.on("stop-screen-share", ({id}: { id: string}) => {
			socket.broadcast.to(room).emit("stop-screen", {
				userId : id
			});
		});
	});
};
