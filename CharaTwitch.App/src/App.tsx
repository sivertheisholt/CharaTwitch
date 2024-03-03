import React from "react";
import { Router } from "./Router";
import { NavBar } from "./components/navbar/NavBar";
import ConfigProvider from "./contexts/ConfigContext";
import HomeProvider from "./contexts/HomeContext";
import SocketProvider from "./contexts/SocketContext";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
	<React.StrictMode>
		<link
			rel="stylesheet"
			href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
			integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
			crossOrigin="anonymous"
		/>
		<div style={{ backgroundColor: "#212529", height: "100vh" }}>
			<SocketProvider>
				<HomeProvider>
					<ConfigProvider>
						<Router>
							<NavBar />
						</Router>
					</ConfigProvider>
				</HomeProvider>
			</SocketProvider>
		</div>
	</React.StrictMode>
);
