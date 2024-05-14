import SocketProvider from "./contexts/SocketContext";
import TwitchConfigProvider from "./contexts/config/TwitchConfigContext";
import OllamaConfigProvider from "./contexts/config/OllamaConfigContext";
import { Router } from "./Router";
import { NavBar } from "./components/navbar/NavBar";
import CharacterProvider from "./contexts/character/CharacterContext";
import TwitchDashboardProvider from "./contexts/dashboard/TwitchDashboardContext";
import AiDashboardProvider from "./contexts/dashboard/AiDashboardContext";
import CaiConfigProvider from "./contexts/config/CaiConfigContext";
import CaiDashboardProvider from "./contexts/dashboard/CaiDashboardContext";
import OllamaDashboardProvider from "./contexts/dashboard/OllamaDashboardContext";
import OllamaParametersProvider from "./contexts/ollama/OllamaParametersContext";

function App() {
	return (
		<div style={{ backgroundColor: "#212529", height: "100vh", overflowX: "auto" }}>
			<SocketProvider>
				<OllamaParametersProvider>
					<OllamaDashboardProvider>
						<CaiDashboardProvider>
							<AiDashboardProvider>
								<TwitchDashboardProvider>
									<TwitchConfigProvider>
										<OllamaConfigProvider>
											<CharacterProvider>
												<CaiConfigProvider>
													<Router>
														<NavBar />
													</Router>
												</CaiConfigProvider>
											</CharacterProvider>
										</OllamaConfigProvider>
									</TwitchConfigProvider>
								</TwitchDashboardProvider>
							</AiDashboardProvider>
						</CaiDashboardProvider>
					</OllamaDashboardProvider>
				</OllamaParametersProvider>
			</SocketProvider>
		</div>
	);
}

export default App;
