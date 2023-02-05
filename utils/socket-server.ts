// SERVER USE ONLY!!

import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Socket } from "socket.io/dist/socket";

class SocketIO {
	_io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
	_socket!: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

	constructor(server: any) {
		this._io = new Server(server);
	}

	get io() {
		return this._io;
	}

	set socket(
		__socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
	) {
		this._socket = __socket;
	}
}

export default SocketIO;
