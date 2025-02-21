"use client";

import { ReactNode } from "react";
import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 5 * 1000,
				retry: 0,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
	if (isServer) {
		return makeQueryClient();
	} else {
		if (!browserQueryClient) browserQueryClient = makeQueryClient();
		return browserQueryClient;
	}
}

export function ModelProvider({ children }: { children: ReactNode }) {
	const queryClient = getQueryClient();

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
