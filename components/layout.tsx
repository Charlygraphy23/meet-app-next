import React from "react";
import { Provider } from "react-redux";
import Store from "store";

type Props = {
	children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
	return (
		<main>
			<Provider store={Store}>{children}</Provider>
		</main>
	);
};

export default Layout;
