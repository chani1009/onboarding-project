import "./globals.css";
import { ReactNode } from "react";
import { ModelProvider } from "@/model/api/ModelProvider";

const RootLayout = async ({ children }: { children: ReactNode }) => {
	return (
		<html>
			<body>
				<ModelProvider> {children}</ModelProvider>
			</body>
		</html>
	);
};

export default RootLayout;
