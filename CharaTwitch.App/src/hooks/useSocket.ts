import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const useSocket = (serverUrl: string) => {
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  useEffect(() => {
    // Create a new socket connection when the component mounts
    const newSocket = io(serverUrl);

    setSocket(newSocket);

    // Set up any event listeners or handlers here
    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.disconnect();
      console.log("Disconnected from server");
    };
  }, [serverUrl]);

  return socket;
};

export default useSocket;
