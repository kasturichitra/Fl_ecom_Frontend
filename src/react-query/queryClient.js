import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false, // Avoid refetching on focus
      refetchOnReconnect: false, // Avoid refetching on reconnect like in case of power cut etc when multiple API calls across page will be made
    },
  },
});

export default queryClient;
