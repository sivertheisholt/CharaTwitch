import "./App.css";
import { Router } from "./Router";
import { NavBar } from "./components/navbar/NavBar";
import ConfigProvider from "./contexts/ConfigContext";
import HomeProvider from "./contexts/HomeContext";
import SocketProvider from "./contexts/SocketContext";

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
