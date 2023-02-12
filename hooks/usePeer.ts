import { Peer } from "peerjs";
import { useEffect, useRef, useState } from "react";

const usePeer = () => {
	const [peer, setPeer] = useState<Peer>();
	const [id, setId] = useState<string>();
	const ref = useRef();

	useEffect(() => {
		if (!peer) return;

		// events
		peer.on("open", function (id: string) {
			console.log("My peer ID is: " + id);
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
	};
};

export default usePeer;
