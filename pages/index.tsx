import HomeComponent from "components/home/index";
import { GetStaticProps, GetStaticPropsContext } from "next/types";

export default function Index() {
	return <>demo</>;
}

export const getStaticProps: GetStaticProps = async (
	context: GetStaticPropsContext
) => {
	return {
		props: {},
		redirect: {
			destination: "/home",
			statusCode: 301,
		},
	};
};
