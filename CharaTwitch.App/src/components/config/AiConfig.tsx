import React, { useContext, useState } from "react";
import { SocketContext } from "../../contexts/SocketContext";
import { SocketContextType } from "../../types/context/SocketContextType";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";
import { OllamaConfigContext } from "../../contexts/config/OllamaConfigContext";
import { OllamaConfigContextType } from "../../types/context/config/OllamaConfigContextType";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import { AI_CONNECT } from "../../socket/AiEvents";
import { AiConnectType } from "../../types/socket/AiConnectType";
import { CoquiContextType } from "../../types/context/config/CoquiContextType";
import { CoquiConfigContext } from "../../contexts/config/CoquiConfigContext";
import { CoquiDashboardContext } from "../../contexts/dashboard/CoquiDashboardContext";
import { CoquiDashboardContextType } from "../../types/context/dashboard/CoquiDashboardContextType";
import { OllamaDashboardContext } from "../../contexts/dashboard/OllamaDashboardContext";
import { OllamaDashboardContextType } from "../../types/context/dashboard/OllamaDashboardContextType";
import { OpenAiConfigContext } from "../../contexts/config/OpenAiConfigContext";
import { OpenAiConfigContextType } from "../../types/context/config/OpenAiConfigContextType";
import { OPENAI_API_KEY_CHANGE } from "../../socket/OpenAiEvents.";

export interface AiConfigProps {}

const AiConfigComponent = (props: AiConfigProps) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const { coquiBaseUrl, setCoquiBaseUrl } = useContext(CoquiConfigContext) as CoquiContextType;
	const { ollamaModelName, setOllamaModelName, ollamaBaseUrl, setOllamaBaseUrl } = useContext(
		OllamaConfigContext
	) as OllamaConfigContextType;
	const { coquiStatus } = useContext(CoquiDashboardContext) as CoquiDashboardContextType;
	const { ollamaStatus } = useContext(OllamaDashboardContext) as OllamaDashboardContextType;
	const { openAiApiKey, setOpenAiApiKey } = useContext(OpenAiConfigContext) as OpenAiConfigContextType;

	const [connectingAi, setConnectingAi] = useState(false);

	const handleOpenAiApiKey = (event: React.ChangeEvent<HTMLInputElement>) => {
		socket.emit(OPENAI_API_KEY_CHANGE, event.target.value);
		setOpenAiApiKey(event.target.value);
	};

	const handleOllamaModelNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setOllamaModelName(event.target.value);
	};

	const handleOllamaBaseUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setOllamaBaseUrl(event.target.value);
	};

	const handleCoquiBaseUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCoquiBaseUrl(event.target.value);
	};

	const handleConnectAi = () => {
		let aiConfig: AiConnectType = {
			coqui_base_url: coquiBaseUrl,
			ollama_base_url: ollamaBaseUrl,
			ollama_model_name: ollamaModelName,
		};
		socket?.emit(AI_CONNECT, aiConfig);
		setConnectingAi(true);
	};

	return (
		<>
			<h2>Ollama</h2>
			<hr className="hr" />
			<label className="fs-4">
				<strong>Model Name</strong>
			</label>
			<InputGroup className="mb-3" size="lg">
				<Form.Control
					value={ollamaModelName}
					onChange={handleOllamaModelNameChange}
					placeholder="Model Name"
					aria-label="Model Name"
				/>
			</InputGroup>
			<label className="fs-4">
				<strong>Ollama Server</strong>
			</label>
			<InputGroup className="mb-3" size="lg">
				<Form.Control
					value={ollamaBaseUrl}
					onChange={handleOllamaBaseUrlChange}
					placeholder="Ollama Server"
					aria-label="Ollama Server"
				/>
			</InputGroup>
			<h2>Coqui</h2>
			<hr className="hr" />
			<label className="fs-4">
				<strong>Coqui Server</strong>
			</label>
			<InputGroup className="mb-3" size="lg">
				<Form.Control
					value={coquiBaseUrl}
					onChange={handleCoquiBaseUrlChange}
					placeholder="Coqui Server"
					aria-label="Coqui Server"
				/>
			</InputGroup>
			<h2>Open AI</h2>
			<hr className="hr" />
			<label className="fs-4">
				<strong>API Key</strong>
			</label>
			<InputGroup className="mb-3" size="lg">
				<Form.Control
					type="password"
					value={openAiApiKey}
					onChange={handleOpenAiApiKey}
					placeholder="API Key"
					aria-label="API Key"
				/>
			</InputGroup>
			<div className="d-grid gap-2 mt-4">
				{ollamaStatus && coquiStatus ? (
					<Alert variant={"success"}>Connected</Alert>
				) : connectingAi ? (
					<Alert variant={"warning"}>Connecting...</Alert>
				) : (
					<Button onClick={handleConnectAi} variant="primary" size="lg">
						Connect
					</Button>
				)}
			</div>
		</>
	);
};

export const AiConfig = React.memo(AiConfigComponent);
