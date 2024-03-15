import React from "react";
import SocketProvider from "./contexts/SocketContext";
import HomeProvider from "./contexts/HomeContext";
import ConfigProvider from "./contexts/ConfigContext";
import { Router } from "./Router";
import { NavBar } from "./components/navbar/NavBar";

function App() {
	return (
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
	);
}

export default App;
