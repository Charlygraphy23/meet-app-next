import HomeComponent from "components/home/index";
import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPropsContext } from "next/types";
import { useEffect, useRef } from "react";
import { nanoid } from "nanoid";

export default function Index() {
	const router = useRouter();
	const ref = useRef();

	useEffect(() => {
		if (ref.current === router) return;
		// @ts-expect-error
		ref.current = router;

		const randomId = nanoid(15);
		router.push(`/${randomId}`);
	}, [router]);

	return <p className='text-center'>Loading....</p>;
}
