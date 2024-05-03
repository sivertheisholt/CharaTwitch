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
import { CAI_SELECTED_VOICE_CHANGE } from "../../socket/CaiEvents";
import { CaiConfigContextType } from "../../types/context/config/CaiConfigContextType";
import { CaiConfigContext } from "../../contexts/config/CaiConfigContext";
import { CaiDashboardContext } from "../../contexts/dashboard/CaiDashboardContext";
import { CaiDashboardContextType } from "../../types/context/dashboard/CaiDashboardContextType";
import { OllamaDashboardContext } from "../../contexts/dashboard/OllamaDashboardContext";
import { OllamaDashboardContextType } from "../../types/context/dashboard/OllamaDashboardContextType";

export interface AiConfigProps {}

const AiConfigComponent = (props: AiConfigProps) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const { caiVoices, caiSelectedVoice, setCaiSelectedVoice, caiBaseUrl, setCaiBaseUrl } = useContext(
		CaiConfigContext
	) as CaiConfigContextType;
	const { ollamaModelName, setOllamaModelName, ollamaBaseUrl, setOllamaBaseUrl } = useContext(
		OllamaConfigContext
	) as OllamaConfigContextType;
	const { caiAccountStatus } = useContext(CaiDashboardContext) as CaiDashboardContextType;
	const { ollamaStatus } = useContext(OllamaDashboardContext) as OllamaDashboardContextType;

	const [connectingAi, setConnectingAi] = useState(false);

	const handleOllamaModelNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setOllamaModelName(event.target.value);
	};

	const handleOllamaBaseUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setOllamaBaseUrl(event.target.value);
	};

	const handleCaiBaseUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCaiBaseUrl(event.target.value);
	};

	const handleCaiSelectVoice = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedVoice = event.target.value;
		socket?.emit(CAI_SELECTED_VOICE_CHANGE, selectedVoice);
		setCaiSelectedVoice(parseInt(selectedVoice));
	};

	const handleConnectAi = () => {
		let aiConfig: AiConnectType = {
			cai_base_url: caiBaseUrl,
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
			<h2>Cai</h2>
			<hr className="hr" />
			<label className="fs-4">
				<strong>CAI Server</strong>
			</label>
			<InputGroup className="mb-3" size="lg">
				<Form.Control
					value={caiBaseUrl}
					onChange={handleCaiBaseUrlChange}
					placeholder="CAI Server"
					aria-label="CAI Server"
				/>
			</InputGroup>
			<label className="fs-4">
				<strong>Voices</strong>
			</label>
			<Form.Select size="lg" onChange={handleCaiSelectVoice} value={caiSelectedVoice} aria-label="CAI Voices">
				{caiVoices.map((voice) => (
					<option key={voice.id} value={voice.id}>
						{voice.name}
					</option>
				))}
			</Form.Select>
			<div className="d-grid gap-2 mt-4">
				{ollamaStatus && caiAccountStatus ? (
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
