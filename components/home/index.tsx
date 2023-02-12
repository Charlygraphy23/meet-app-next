import Button from "components/button";
import { useRouter } from "next/router";
import React from "react";
import VideoStream from "./../videoStream/index";

type Props = {
	switchView: () => void;
};

const HomeComponent = ({ switchView }: Props) => {
	const router = useRouter();

	return (
		<div className='homeComponent container-fluid'>
			<div className='row w-100 justify-content-center wrapper' >
				<div className='leftAlign col-md-8' style={{maxHeight : '400px'}}>
					<VideoStream myStream controls/>
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
