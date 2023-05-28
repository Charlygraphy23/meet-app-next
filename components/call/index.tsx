import VideoStream from "components/videoStream";
import { StreamType } from "hooks/usePeer";
import { UserStream } from "interface";
import Peer from "peerjs";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { StoreType } from "store";

type Props = {
	streams: UserStream[];
	updateStream: (stream : UserStream) => void;
	peer?: Peer,
	hasScreenShared: boolean
	replacePeer: (stream: MediaStream, type: StreamType) => void,
};

const CallComponent = ({ streams , updateStream , peer,hasScreenShared, ...rest}: Props) => {
	const { socket, ownId } = useSelector(
		(state: StoreType) => state.SocketReducer
	);

	

	const determineColumn = useCallback((isScreenShare : boolean) => {	
		console.log("hasScreenShared", hasScreenShared)
		
		if(hasScreenShared){

			// when only one user is present in the meet
			if(streams.length === 1){
				return 12
			}

			// make shared screen large
			if(isScreenShare){
                return 10
            }

			// make other screen small
			return 2

		}
		
		switch (streams.length) {
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
	}, [hasScreenShared, streams.length]);

	useEffect(() => {
		if (!socket) return;
		if (!socket.connected) return;
	}, [socket]);



	return (
		<div className={`row m-0 justify-content-center`}>
			{streams.map((data, i) => (
				<div
					className={`${`col-${determineColumn(data.screenShare)}`}`}
					style={{ marginBottom: streams?.length > 1 ? "1rem" : '0rem', maxHeight: "700px" , height: hasScreenShared ? 'fit-content' : "100%"}}
					key={i}>
					<VideoStream
						isMyStream={data.userId === ownId}
						style={{}}
						stream={data}
						updateStream={updateStream}
						peer={peer}
						hasScreenShared={hasScreenShared}
						{...rest}
					/>
				</div>
			))}
		</div>
	);
};

export default CallComponent;
