import VideoStream from "components/videoStream";
import { UserStream } from "interface";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StoreType } from "store";
import css from "./style.module.scss";

type Props = {
	streams: UserStream[];
};

const CallComponent = ({ streams }: Props) => {
	const { socket, ownId } = useSelector(
		(state: StoreType) => state.SocketReducer
	);

	const determineColumn = useCallback((length: number) => {
		switch (length) {
			case 1:
				return 12;
			case 2:
				return 6;
			case 3:
				return 4;
			case 4:
				return 3;
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
				return 3;
			default:
				return 2;
		}
	}, []);

	useEffect(() => {
		if (!socket) return;
		if (!socket.connected) return;
	}, [socket]);

	return (
		<div className={`row m-0 justify-content-center`}>
			{streams.map((data, i) => (
				<div
					className={`col-${determineColumn(streams.length)}`}
					style={{ marginBottom: "1rem", maxHeight: "700px" }}
					key={i}>
					<VideoStream
						myStream={data.userId === ownId}
						style={{}}
						mediaStream={data.stream}
					/>
				</div>
			))}
		</div>
	);
};

export default CallComponent;
