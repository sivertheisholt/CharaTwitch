import SocketProvider from "./contexts/SocketContext";
import TwitchConfigProvider from "./contexts/config/TwitchConfigContext";
import OllamaConfigProvider from "./contexts/config/OllamaConfigContext";
import { Router } from "./Router";
import { NavBar } from "./components/navbar/NavBar";
import CharacterProvider from "./contexts/character/CharacterContext";
import TwitchDashboardProvider from "./contexts/dashboard/TwitchDashboardContext";
import AiDashboardProvider from "./contexts/dashboard/AiDashboardContext";
import CoquiConfigProvider from "./contexts/config/CoquiConfigContext";
import CoquiDashboardProvider from "./contexts/dashboard/CoquiDashboardContext";
import OllamaDashboardProvider from "./contexts/dashboard/OllamaDashboardContext";
import OllamaParametersProvider from "./contexts/ollama/OllamaParametersContext";
import VoiceContextProvider from "./contexts/voice/VoiceContext";
import OpenAiConfigProvider from "./contexts/config/OpenAiConfigContext";

function App() {
	return (
		<div style={{ backgroundColor: "#212529", height: "100vh", overflowX: "auto" }}>
			<SocketProvider>
				<OllamaParametersProvider>
					<OllamaDashboardProvider>
						<CoquiDashboardProvider>
							<AiDashboardProvider>
								<TwitchDashboardProvider>
									<TwitchConfigProvider>
										<OllamaConfigProvider>
											<CharacterProvider>
												<CoquiConfigProvider>
													<OpenAiConfigProvider>
														<VoiceContextProvider>
															<Router>
																<NavBar />
															</Router>
														</VoiceContextProvider>
													</OpenAiConfigProvider>
												</CoquiConfigProvider>
											</CharacterProvider>
										</OllamaConfigProvider>
									</TwitchConfigProvider>
								</TwitchDashboardProvider>
							</AiDashboardProvider>
						</CoquiDashboardProvider>
					</OllamaDashboardProvider>
				</OllamaParametersProvider>
			</SocketProvider>
		</div>
	);
}

export default App;
