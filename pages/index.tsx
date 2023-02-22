import HomeComponent from "components/home/index";
import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPropsContext } from "next/types";
import { useEffect, useRef } from "react";

export default function Index() {
	const router = useRouter()
	const ref = useRef()

	useEffect(()=> {

		if(ref.current) return;
		// @ts-expect-error
		ref.current = true


		// router.push(`/${}`)

	} ,[])


	return <>demo</>;
}