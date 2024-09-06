import { useEffect } from "react";

const useWebSocket = (url: string) => {
  useEffect(() => {
    const ws = new WebSocket(url);
    // Add event listeners and handle messages
    return () => {
      ws.close();
    };
  }, [url]);
};

export default useWebSocket;
