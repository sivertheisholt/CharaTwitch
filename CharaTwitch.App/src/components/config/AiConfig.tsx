import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../contexts/SocketContext";
import { SocketContextType } from "../../types/context/SocketContextType";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";
import { OllamaConfigContext } from "../../contexts/config/OllamaConfigContext";
import { OllamaConfigContextType } from "../../types/context/config/OllamaConfigContextType";
import { AiDashboardContext } from "../../contexts/dashboard/AiDashboardContext";
import { AiDashboardContextType } from "../../types/context/dashboard/AiDashboardContextType";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import { AI_CONNECT } from "../../socket/AiEvents";
import { AiConnectType } from "../../types/socket/AiConnectType";
import { CAI_SELECTED_VOICE_CHANGE } from "../../socket/CaiEvents";
import { CaiConfigContextType } from "../../types/context/config/CaiConfigContextType";
import { CaiConfigContext } from "../../contexts/config/CaiConfigContext";

export interface AiConfigProps {}

const AiConfigComponent = (props: AiConfigProps) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const { caiVoices, caiSelectedVoice, setCaiSelectedVoice, caiBaseUrl, setCaiBaseUrl } = useContext(
		CaiConfigContext
	) as CaiConfigContextType;
	const { ollamaModelName, setOllamaModelName, ollamaBaseUrl, setOllamaBaseUrl } = useContext(
		OllamaConfigContext
	) as OllamaConfigContextType;
	const { aiConnectedStatus } = useContext(AiDashboardContext) as AiDashboardContextType;

	const [connectingAi, setConnectingAi] = useState(false);

	const handleOllamaModelName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setOllamaModelName(event.target.value);
	};

	const handleOllamaBaseUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
		setOllamaBaseUrl(event.target.value);
	};

	const handleCaiBaseUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
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
			<h2>Cai</h2>
			<hr className="hr" />
			<label className="fs-4">
				<strong>CAI Server</strong>
			</label>
			<InputGroup className="mb-3" size="lg">
				<Form.Control value={caiBaseUrl} onChange={handleCaiBaseUrl} placeholder="CAI Server" aria-label="CAI Server" />
			</InputGroup>
			<label className="fs-4">
				<strong>Voices</strong>
			</label>
			<Form.Select
				size="lg"
				onChange={handleCaiSelectVoice}
				value={caiSelectedVoice}
				aria-label="Default select example"
			>
				{caiVoices.map((voice) => (
					<option key={voice.id} value={voice.id}>
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
