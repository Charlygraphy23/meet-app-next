import classNames from "classnames";
import Button from "components/button";
import { UserStream } from "interface";
import Peer from "peerjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getLocalMediaStream } from "utils";
import Emitter from "utils/emitter";
import CallComponent from ".";
import css from "./style.module.scss";
import { useSelector } from "react-redux";
import { StoreType } from "store";

type Props = {
	peer?: Peer;
};

const CallLayout = ({ peer }: Props) => {
	const [streams, setStreams] = useState<UserStream[]>([]);
	const [videoState, setVideoState] = useState({
		mute: false,
		video: true,
	});
	const videoEffectRef = useRef();
	const peerRef = useRef();
	const streamsRef = useRef();

	const { socket } = useSelector((state: StoreType) => state.SocketReducer);

	const getVideo = useCallback(async () => {
		if (!peer) return;

		try {
			const _stream = await getLocalMediaStream({ video: true, audio: true });
			console.log(_stream);
			setStreams([
				{
					stream: _stream,
					userId: peer.id,
				},
			]);
		} catch (err) {
			console.error(err);
		}
	}, [peer]);

	const toggleVideo = useCallback(() => {
		Emitter.emit("TOGGLE-TOOL", "video");
		setVideoState((prevState) => ({
			...prevState,
			video: !prevState.video,
		}));
	}, []);

	const toggleAudio = useCallback(() => {
		Emitter.emit("TOGGLE-TOOL", "mic");
		setVideoState((prevState) => ({
			...prevState,
			mute: !prevState.mute,
		}));
	}, []);

	useEffect(() => {
		if (!peer) return;

		if (videoEffectRef.current === peer.id) return;
		// @ts-expect-error
		videoEffectRef.current = peer.id;

		getVideo();
	}, [getVideo, peer]);

	useEffect(() => {
		if(!peer) return;

		peer.on("call", (call) => {
			const otherUserId = call.peer;
			console.log("Answer", streams);
			call.answer(streams?.[0]?.stream);
			call.on("stream", function (otherUserStream) {
				console.log("Other Stream ", otherUserStream);

				// if (!streamSet.has(otherUserStream.id)) {
				//     createVideo(otherUserStream , otherUserId)
				//     streamSet.add(otherUserStream.id)
				// }
				setStreams((prevState) => {

					const hasStream = prevState.find(stream =>  stream.userId === otherUserId)

					if(!hasStream)
					return [
						...prevState,
						{
							stream: otherUserStream,
							userId: otherUserId,
						},
					]


					return prevState
				});
			});
		});

		return () => {
			if(!peer) return;

			peer.off('call')
		}
	}, [peer, streams]);

	useEffect(() => {
		if (!socket) return;
		if (!socket.connected) return;

		socket.on("joined", ({ userId }) => {
			if (!peer) return;
			console.log("New USer Joined 1");
			const ownMediaStream = streams?.[0]?.stream;
			if (ownMediaStream) {
				console.log("New USer Joined");
				const _call = peer.call(userId, ownMediaStream);

				_call.on("stream", function (otherUserStream: MediaStream) {
					console.log("Stream CALL", otherUserStream);


					setStreams((prevState) => {

					const hasStream = prevState.find(stream =>  stream.userId === userId)

					if(!hasStream)
					return [
						...prevState,
						{
							stream: otherUserStream,
							userId
						},
					]


					return prevState
				});

					// if (!streamSet.has(otherUserStream.id)) {
					// 	createVideo(otherUserStream, anotherUserId);
					// 	streamSet.add(otherUserStream.id);
					// }
				});
			}
		});

		socket.on("delete-video", (userId) => {
			setStreams(prevState => {
				return prevState.filter(stream => stream.userId === userId)
			})
						
		});


		return () => {
			if (!socket) return;
			if (!socket.connected) return;
			socket.off("joined");
			socket.off("delete-video");
		};
	}, [peer, socket, streams]);

	return (
		<div className={css.callLayout}>
			<div
				className='row m-0 justify-content-center align-items-center'
				style={{
					flex: 1,
					maxHeight: `${innerHeight - 90}px`,
					overflow: "auto",
				}}>
				<div className='col-12'>
					<CallComponent streams={streams} />
				</div>
			</div>

			<div className='row m-0 justify-content-center'>
				<div className='col-12'>
					<div className={css.control__group}>
						<Button
							className={classNames("", {
								error: videoState.mute,
							})}
							onClick={toggleAudio}>
							<i className={`bi bi-mic${videoState.mute ? "-mute" : ""}`}></i>
						</Button>
						<Button
							className={classNames("", {
								error: !videoState.video,
							})}
							onClick={toggleVideo}>
							<i
								className={`bi bi-camera-video${
									!videoState.video ? "-off" : ""
								}`}></i>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CallLayout;
