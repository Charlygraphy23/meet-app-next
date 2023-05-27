import classNames from "classnames";
import Button from "components/button";
import { UserStream } from "interface";
import Peer from "peerjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Emitter from "utils/emitter";
import CallComponent from ".";
import css from "./style.module.scss";
import { useSelector } from "react-redux";
import { StoreType } from "store";
import { useRouter } from "next/router";
import { getLocalShareScreen, getLocalMediaStream, toggleVideoCamera } from "utils";
import { StreamType } from "hooks/usePeer";

type Props = {
	peer?: Peer;
	stream: UserStream;
	update: (stream: UserStream) => void
	replacePeer: (stream: MediaStream, type: StreamType) => void
};

const CallLayout = ({ peer, stream: myStream, replacePeer }: Props) => {
	const [streams, setStreams] = useState<UserStream[]>([]);
	const videoEffectRef = useRef();
	const { socket, ownId } = useSelector((state: StoreType) => state.SocketReducer);
	const router = useRouter()

	const updateStream = useCallback((_stream: UserStream) => {
		const userID = _stream.userId;
		setStreams((prevState) => prevState.map(data => {

			if (data.userId === userID) {
				return {
					...data,
					..._stream
				}
			}
			return data
		}))

	}, [])

	const toggleVideo = useCallback(async () => {
		const isVideo = streams?.[0]?.video

		Emitter.emit("TOGGLE-TOOL", { type: "video", payload :{
			userId: ownId,
			video: !isVideo
		}});



	}, [ownId, streams]);

	const toggleAudio = useCallback(() => {
		const isMute = streams?.[0]?.mute
		Emitter.emit("TOGGLE-TOOL", { type: "mic", payload :{
			userId: ownId,
			video: isMute
		} });

		
	}, [ownId, streams]);


	const handleShareScreen = useCallback(async () => {

		const screenVideo = await getLocalShareScreen()
		console.log("DD", screenVideo)

		streams[0].stream.removeTrack(streams[0].stream.getVideoTracks()[0])
		streams[0].stream.addTrack(screenVideo.getTracks()[0])


		screenVideo.getVideoTracks()[0].onended = async function () {
			// doWhatYouNeedToDo();
			const localStream = await getLocalMediaStream({ video: true, audio: false })
			streams[0].stream.removeTrack(screenVideo.getTracks()[0])
			streams[0].stream.addTrack(localStream.getVideoTracks()[0])

			replacePeer(localStream, localStream.getVideoTracks()[0].kind as StreamType)
		};

		replacePeer(screenVideo, screenVideo.getVideoTracks()[0].kind as StreamType)

	}, [replacePeer, streams])


	useEffect(() => {
		if (!myStream) return;

		if (videoEffectRef.current === myStream.stream) return;
		// @ts-expect-error
		videoEffectRef.current = myStream.stream;

		setStreams([myStream])
	}, [myStream]);

	const handleClose = useCallback(() => {
		router.replace('/close')
		socket?.disconnect()
	}, [socket, router])


	useEffect(() => {
		if (!peer) return;

		peer.on("call", (call) => {
			const myStream = streams?.[0]?.stream
			const otherUserId = call.peer;


			if (!myStream) return;
			call.answer(myStream);
			call.on("stream", function (otherUserStream) {

				setStreams((prevState) => {
					const hasStream = prevState.find(stream => stream.userId === otherUserId)

					if (!hasStream)
						return [
							...prevState,
							{
								stream: otherUserStream,
								userId: otherUserId,
								video: call?.metadata?.video,
								mute: call?.metadata?.mute,
								name: call?.metadata?.name || ""
							},
						]


					return prevState
				});
			});
		});

	}, [peer, streams]);

	useEffect(() => {
		if (!socket) return;
		if (!socket.connected) return;

		socket.on("joined", ({ userId, name, video, mute }) => {
			if (!peer) return;
			const ownMediaStream = streams?.[0]?.stream;
			if (ownMediaStream) {
				const _call = peer.call(userId, ownMediaStream, { metadata: { name, video: streams?.[0].video, mute: streams?.[0].mute } });

				_call.on("stream", function (otherUserStream: MediaStream) {

					setStreams((prevState) => {
						const hasStream = prevState.find(stream => stream.userId === userId)

						if (!hasStream)
							return [
								...prevState,
								{
									stream: otherUserStream,
									userId,
									video: video,
									mute: mute,
									name: name || ""
								},
							]


						return prevState
					});

				});
			}
		});

		socket.on("delete-video", (userId) => {
			setStreams(prevState => {
				return prevState.filter(stream => stream.userId !== userId)
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
					<CallComponent streams={streams} updateStream={updateStream} peer={peer} replacePeer={replacePeer}/>
				</div>
			</div>

			<div className='row m-0 justify-content-center'>
				<div className='col-12'>
					<div className={css.control__group}>
						<Button
							className={classNames("", {
								error: streams?.[0]?.mute,
							})}
							onClick={toggleAudio}>
							<i className={`bi bi-mic${streams?.[0]?.mute ? "-mute" : ""}`}></i>
						</Button>
						<Button
							className={classNames("", {
								error: !streams?.[0]?.video,
							})}
							onClick={toggleVideo}>
							<i
								className={`bi bi-camera-video${!streams?.[0]?.video ? "-off" : ""
									}`}></i>
						</Button>
						{/* <Button
							onClick={handleShareScreen}>
							<i
								className={`bi bi-arrow-up-circle`}></i>
						</Button> */}
						<Button
							className={classNames("", {
								error: true,
							})}
							onClick={handleClose}>
							<i className={`bi bi-telephone-fill ${css.icon_rotate}`} style={{ transform: 'rotate(95deg)' }}></i>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CallLayout;
