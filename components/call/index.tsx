import VideoStream from "components/videoStream";
import React, { useCallback } from "react";
import css from './style.module.scss'

const oneElementStyle: React.CSSProperties = {

}

const CallComponent = () => {

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



	}, [])

	return (
		<div className={`row m-0 justify-content-center`}>
			{Array(1).fill(0).map((_, i, arr) => <div className={`col-${determineColumn(arr.length)}`} style={{ marginBottom: "1rem", maxHeight: '700px' }} key={i} >
				<VideoStream myStream style={{}} />
			</div>
			)}



		</div>
	);
};

export default CallComponent;
