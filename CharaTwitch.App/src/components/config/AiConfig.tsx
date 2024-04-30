import React, { useContext, useState } from "react";
import { SocketContext } from "../../contexts/SocketContext";
import { SocketContextType } from "../../types/context/SocketContextType";
import { ElevenlabsConfigContext } from "../../contexts/config/ElevenlabsConfigContext";
import { ELEVENLABS_SELECTED_VOICE_CHANGE } from "../../socket/ElevenlabsEvents";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";
import { OllamaConfigContext } from "../../contexts/config/OllamaConfigContext";
import { OllamaConfigContextType } from "../../types/context/config/OllamaConfigContextType";
import { AiDashboardContext } from "../../contexts/dashboard/AiDashboardContext";
import { AiDashboardContextType } from "../../types/context/dashboard/AiDashboardContextType";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import { AI_CONNECT } from "../../socket/AiEvents";
import { ElevenlabsConfigContextType } from "../../types/context/config/ElevenlabsConfigContextType";
import { AiConnectType } from "../../types/socket/AiConnectType";

export interface AiConfigProps {}

const AiConfigComponent = (props: AiConfigProps) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const {
		elevenlabsApiKey,
		setElevenlabsApiKey,
		elevenlabsVoices,
		elevenlabsSelectedVoice,
		setElevenlabsSelectedVoice,
	} = useContext(ElevenlabsConfigContext) as ElevenlabsConfigContextType;
	const { ollamaModelName, setOllamaModelName, ollamaBaseUrl, setOllamaBaseUrl } = useContext(
		OllamaConfigContext
	) as OllamaConfigContextType;
	const { aiConnectedStatus } = useContext(AiDashboardContext) as AiDashboardContextType;

	const [connectingAi, setConnectingAi] = useState(false);

	const handleOllamaApiKey = (event: React.ChangeEvent<HTMLInputElement>) => {
		setElevenlabsApiKey(event.target.value);
	};

	const handleElevenlabsSelectVoice = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedRedeem = event.target.value;
		socket.emit(ELEVENLABS_SELECTED_VOICE_CHANGE, selectedRedeem);
		setElevenlabsSelectedVoice(selectedRedeem);
	};

	const handleOllamaModelName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setOllamaModelName(event.target.value);
	};

	const handleOllamaBaseUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
		setOllamaBaseUrl(event.target.value);
	};

	const handleConnectAi = () => {
		setConnectingAi(true);
		let aiConfig: AiConnectType = {
			elevenlabs_api_key: elevenlabsApiKey,
			ollama_base_url: ollamaBaseUrl,
			ollama_model_name: ollamaModelName,
		};
		socket.emit(AI_CONNECT, aiConfig);
	};

	return (
		<>
			<h2>Elevenlabs</h2>
			<hr className="hr" />
			<label className="fs-4">
				<strong>Model Name</strong>
			</label>
			<InputGroup className="mb-3" size="lg">
				<Form.Control
					value={ollamaModelName}
					onChange={handleOllamaModelName}
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
					onChange={handleOllamaBaseUrl}
					placeholder="Ollama Server"
					aria-label="Ollama Server"
				/>
			</InputGroup>
			<h2>Ollama</h2>
			<hr className="hr" />
			<label className="fs-4">
				<strong>API Key</strong>
			</label>
			<InputGroup className="mb-3" size="lg">
				<Form.Control
					value={elevenlabsApiKey}
					onChange={handleOllamaApiKey}
					placeholder="API Key"
					aria-label="API Key"
					type="password"
				/>
			</InputGroup>
			<label className="fs-4">
				<strong>Voices</strong>
			</label>
			<Form.Select
				size="lg"
				onChange={handleElevenlabsSelectVoice}
				value={elevenlabsSelectedVoice}
				aria-label="Default select example"
			>
				{elevenlabsVoices.map((voice) => (
					<option key={voice.voice_id} value={voice.voice_id}>
						{voice.name}
					</option>
				))}
			</Form.Select>
			<div className="d-grid gap-2 mt-4">
				{aiConnectedStatus ? (
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
