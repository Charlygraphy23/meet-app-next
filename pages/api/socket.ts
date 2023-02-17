import type { NextApiRequest, NextApiResponse } from "next";
import { Socket } from "socket.io/dist/socket";
import SocketIO from "utils/socket-server";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Server } from "socket.io";
import { socketEvents } from "utils/socket-events";

type Data = {
	server: Server;
};

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	// @ts-expect-error
	if (res?.socket?.server?.io) {
		console.log("Socket is already connected");
	} else {
		// @ts-expect-error
		const socketIo = new SocketIO(res.socket?.server);
		const { io } = socketIo;

		io.on(
			"connection",
			(
				socket: Socket<
					DefaultEventsMap,
					DefaultEventsMap,
					DefaultEventsMap,
					any
				>
			) => {
				socketIo.socket = socket;
				socketEvents(io, socket);
			}
		);

		// @ts-expect-error
		res.socket.server.io = io;
	}

	res.end();
}
