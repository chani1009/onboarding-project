import "./globals.css";
import { ReactNode } from "react";

const RootLayout = async ({ children }: { children: ReactNode }) => {
	return (
		<html>
			<body>{children}</body>
		</html>
	);
};

export default RootLayout;
