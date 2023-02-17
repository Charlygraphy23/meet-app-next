import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const socketEvents = (
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
	socket.on("join-room", (payload: any) => {
		const { room, userId } = payload;
		console.log("User Joined ", room);
		socket.join(room);
		socket.broadcast.to(room).emit("joined", { userId });
		socket.on("disconnect", () => {
			console.log("Socket Disconnected", socket.id);
			socket.broadcast.to(room).emit("delete-video", userId);
		});
	});
};
