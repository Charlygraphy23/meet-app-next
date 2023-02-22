import Button from "components/button";
import { UserStream } from "interface";
import React from "react";
import VideoStream from "./../videoStream/index";

type Props = {
	switchView: () => void;
	stream: NonNullable<UserStream>;
	updateStream: (stream : UserStream) => void
};

const HomeComponent = ({ switchView, stream , updateStream}: Props) => {

	return (
		<div className='homeComponent container-fluid'>
			<div className='row w-100 justify-content-center wrapper'>
				<div className='leftAlign col-md-8' style={{ maxHeight: "400px" }}>
					<VideoStream isMyStream={true} controls stream={stream} updateStream={updateStream}/>
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
