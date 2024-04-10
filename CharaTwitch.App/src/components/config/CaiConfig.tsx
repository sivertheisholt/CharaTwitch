import React, { useContext, useState } from "react";
import { ConfigContext } from "../../contexts/ConfigContext";
import { HomeContext } from "../../contexts/HomeContext";
import { SocketContext } from "../../contexts/SocketContext";
import { ConfigContextType } from "../../types/ConfigContextType";
import { HomeContextType } from "../../types/HomeContextType";
import { SocketContextType } from "../../types/SocketContextType";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";

export interface CaiConfigProps {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CaiConfigComponent = (props: CaiConfigProps) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const [connectingCai, setConnectingCai] = useState(false);
	const { caiVoices, caiAccountStatus } = useContext(HomeContext) as HomeContextType;
	const {
		caiCharacterId,
		setCaiCharacterId,
		caiSelectedVoice,
		setCaiSelectedVoice,
		caiBaseUrl,
		setCaiBaseUrl,
	} = useContext(ConfigContext) as ConfigContextType;

	const authCai = () => {
		setConnectingCai(true);
		socket?.emit("caiAuth", {
			character_id: caiCharacterId,
			base_url: caiBaseUrl,
		});
	};
	const handleCaiSelectVoice = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedVoice = event.target.value;
		socket?.emit("caiSelectVoice", selectedVoice);
		setCaiSelectedVoice(parseInt(selectedVoice));
	};
	const handleCaiCharacterId = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCaiCharacterId(event.target.value);
	};
	const handleCaiBaseUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCaiBaseUrl(event.target.value);
	};
	return (
		<>
			<h1>CAI config</h1>
			<hr className="hr" />
			<label className="fs-4">
				<strong>Character ID</strong>
			</label>
			<InputGroup className="mb-3" size="lg">
				<Form.Control
					value={caiCharacterId}
					onChange={handleCaiCharacterId}
					placeholder="Character ID"
					aria-label="Character ID"
					aria-describedby="cai-character-id"
				/>
			</InputGroup>
			<label className="fs-4">
				<strong>Server</strong>
			</label>
			<InputGroup className="mb-3" size="lg">
				<Form.Control
					value={caiBaseUrl}
					onChange={handleCaiBaseUrl}
					placeholder="Server"
					aria-label="Server"
				/>
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
				{caiAccountStatus ? (
					<Alert variant={"success"}>Connected</Alert>
				) : connectingCai ? (
					<Alert variant={"warning"}>Connecting...</Alert>
				) : (
					<Button onClick={authCai} variant="primary" size="lg">
						Connect
					</Button>
				)}
			</div>
		</>
	);
};

export const CaiConfig = React.memo(CaiConfigComponent);
