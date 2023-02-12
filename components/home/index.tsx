import Button from "components/button";
import { UserStream } from "interface";
import { useRouter } from "next/router";
import React from "react";
import VideoStream from "./../videoStream/index";
import { useSelector } from "react-redux";
import { StoreType } from "store";

type Props = {
	switchView: () => void;
	stream?: UserStream;
};

const HomeComponent = ({ switchView, stream }: Props) => {
	const { ownId } = useSelector((state: StoreType) => state.SocketReducer);

	return (
		<div className='homeComponent container-fluid'>
			<div className='row w-100 justify-content-center wrapper'>
				<div className='leftAlign col-md-8' style={{ maxHeight: "400px" }}>
					<VideoStream myStream={true} controls mediaStream={stream?.stream} />
				</div>
				<div className='rightAlign col-md-4'>
					<p>Ready to join?</p>
					<Button onClick={switchView}>Join now</Button>
				</div>
			</div>
		</div>
	);
};

export default HomeComponent;
