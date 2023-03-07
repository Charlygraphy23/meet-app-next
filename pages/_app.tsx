import "styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "components/layout";
import { SessionProvider } from "next-auth/react"
import ErrorBoundary from "components/error";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {

	return (
		<ErrorBoundary>
			<SessionProvider session={session} refetchInterval={5 * 60}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</SessionProvider>
		</ErrorBoundary>
	);
}
