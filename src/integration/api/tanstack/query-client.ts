import { isServer, QueryClient } from "@tanstack/react-query";

import { type ApiError } from "../api-error";

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Product data changes rarely; avoid refetching on every remount.
        staleTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

let browserQueryClient: QueryClient | undefined;

export const getQueryClient = () => {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
};

export { makeQueryClient };

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError;
  }
}
