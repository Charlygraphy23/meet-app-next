import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const socketEvents = (
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
	socket.on("join-room", (payload: any) => {
		const { room, userId , name} = payload;
		console.log("User Joined ", room);
		socket.join(room);
		socket.broadcast.to(room).emit("joined", { userId , name});
		socket.on("disconnect", () => {
			console.log("Socket Disconnected", socket.id);
			socket.broadcast.to(room).emit("delete-video", userId);
		});

		socket.on("toggle-audio-emit", (isMute: boolean) => {
			socket.broadcast.to(room).emit("toggle-audio", {
				mute : isMute,
				userId
			});
		});

		socket.on("toggle-video-emit", ({isVideo , id}: {isVideo: boolean , id: string}) => {
			socket.broadcast.to(room).emit("toggle-video", {
				video : isVideo,
				userId : id
			});
		});
	});
};
