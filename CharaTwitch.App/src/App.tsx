import SocketProvider from "./contexts/SocketContext";
import HomeProvider from "./contexts/HomeContext";
import ConfigProvider from "./contexts/ConfigContext";
import { Router } from "./Router";
import { NavBar } from "./components/navbar/NavBar";
import CharacterProvider from "./contexts/CharacterContext";

function App() {
	return (
		<div style={{ backgroundColor: "#212529", height: "100vh", overflowX: "auto" }}>
			<SocketProvider>
				<HomeProvider>
					<ConfigProvider>
						<CharacterProvider>
							<Router>
								<NavBar />
							</Router>
						</CharacterProvider>
					</ConfigProvider>
				</HomeProvider>
			</SocketProvider>
		</div>
	);
}

export default App;
