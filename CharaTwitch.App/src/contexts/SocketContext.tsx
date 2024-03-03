import React, { createContext, useEffect, useState } from "react";
import { SocketContextType } from "../types/SocketContextType";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Socket, io } from "socket.io-client";

// Create a context for the socket
export const SocketContext = createContext<SocketContextType | null>(null);

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
		null
	);
	const serverUrl = "http://localhost:8001";

	useEffect(() => {
		// Create a new socket connection when the component mounts
		const newSocket = io(serverUrl);

		// Set up any event listeners or handlers here
		newSocket.on("connect", () => {
			console.log("Connected to server");
			setSocket(newSocket);
		});
		// Clean up the socket connection when the component unmounts
		return () => {
			newSocket.disconnect();
			console.log("Disconnected from server");
		};
	}, [serverUrl]);
	return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
