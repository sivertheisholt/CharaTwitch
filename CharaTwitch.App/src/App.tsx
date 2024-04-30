import SocketProvider from "./contexts/SocketContext";
import TwitchConfigProvider from "./contexts/config/TwitchConfigContext";
import OllamaConfigProvider from "./contexts/config/OllamaConfigContext";
import { Router } from "./Router";
import { NavBar } from "./components/navbar/NavBar";
import CharacterProvider from "./contexts/character/CharacterContext";
import OllamaDashboardProvider from "./contexts/dashboard/OllamaDashboardContext";
import TwitchDashboardProvider from "./contexts/dashboard/TwitchDashboardContext";
import EvenlabsConfigProvider from "./contexts/config/ElevenlabsConfigContext";

function App() {
	return (
		<div style={{ backgroundColor: "#212529", height: "100vh", overflowX: "auto" }}>
			<SocketProvider>
				<OllamaDashboardProvider>
					<TwitchDashboardProvider>
						<TwitchConfigProvider>
							<OllamaConfigProvider>
								<CharacterProvider>
									<EvenlabsConfigProvider>
										<Router>
											<NavBar />
										</Router>
									</EvenlabsConfigProvider>
								</CharacterProvider>
							</OllamaConfigProvider>
						</TwitchConfigProvider>
					</TwitchDashboardProvider>
				</OllamaDashboardProvider>
			</SocketProvider>
		</div>
	);
}

export default App;
