import { useSession } from "next-auth/react"
import { Peer } from "peerjs";
import { useEffect, useRef, useState } from "react";

export type StreamType = 'video' | 'audio' 


const usePeer = () => {
	const [peer, setPeer] = useState<Peer>();
	const [id, setId] = useState<string>();
	const ref = useRef();

	const findKindIndex = (tracks: MediaStreamTrack[], type: StreamType) => {
		return Array.from(tracks)
	}

	const replaceTrack = (stream : MediaStream , type: StreamType ) => {
		if(!peer) { throw new Error("No peer available"); }

		// @ts-expect-error
		for (let [key, value] of peer._connections.entries()) {

			// @ts-expect-error
			const senderTrackIndex = peer?._connections.get(key)[0].peerConnection.getSenders().findIndex((track: any) => track.track.kind === type)
			const newTrackIndex = stream.getTracks().findIndex(track => track.kind === type)

			// @ts-expect-error
			peer._connections.get(key)[0].peerConnection.getSenders()[senderTrackIndex].replaceTrack(stream.getTracks()[newTrackIndex])
		}
	}

	useEffect(() => {
		if (!peer) return;

		// events
		peer.on("open", function (id: string) {
			setId(id);
		});

		return () => {
			peer.disconnect();
			peer.destroy();
		};
	}, [peer]);

	// Init Peer Js
	useEffect(() => {

		if (ref.current) return;
		// @ts-expect-error
		ref.current = true;

		const fn = async () => {
			const PeerJs = (await import("peerjs")).default;
			const peer = new PeerJs("", {});

			setPeer(peer);
		};
		fn();
	}, []);

	return {
		peer,
		id,
		replaceTrack
	};
};

export default usePeer;
