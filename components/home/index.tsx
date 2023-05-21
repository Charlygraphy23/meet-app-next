import Button from "components/button";
import { UserStream } from "interface";
import Image from "next/image";
import React, { useCallback } from "react";
import VideoStream from "./../videoStream/index";
import {signIn, useSession} from 'next-auth/react'

type Props = {
	switchView: () => void;
	stream: NonNullable<UserStream>;
	updateStream: (stream: UserStream) => void
};

const HomeComponent = ({ switchView, stream, updateStream }: Props) => {

	const { data: session } = useSession();

	const handleGoogleLogin = useCallback(
	  () => {
		signIn("google")
	  },
	  [],
	)
	

	return (
		<div className='homeComponent container-fluid'>
			<div className='row w-100 justify-content-center wrapper'>
				<div className='leftAlign col-md-8' style={{ maxHeight: "400px" }}>
					<VideoStream isMyStream={true} controls stream={stream} updateStream={updateStream} />
				</div>
				<div className='rightAlign col-md-4 mt-5'>
					<p>Ready to join?</p>
					{session && <Button onClick={() => {
						if(stream.loading) return;

						switchView()
					}}>{stream.loading ? 'Loading..' : 'Join now'}</Button>}
					{!session && <Button className="google__sign" onClick={handleGoogleLogin}><Image src="https://img.icons8.com/color/48/null/google-logo.png" alt={"google_icon"} width={20} height={20} /> <span>Sign In With Google</span></Button>}
				</div>
			</div>
		</div>
	);
};

export default HomeComponent;
