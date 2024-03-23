import React, { useContext, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/esm/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Row from "react-bootstrap/esm/Row";
import { SocketContextType } from "../types/SocketContextType";
import { SocketContext } from "../contexts/SocketContext";
import { HomeContext } from "../contexts/HomeContext";
import { HomeContextType } from "../types/HomeContextType";
import { ConfigContext } from "../contexts/ConfigContext";
import { ConfigContextType } from "../types/ConfigContextType";
import Alert from "react-bootstrap/esm/Alert";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConfigPageProps {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ConfigPageComponent = (props: ConfigPageProps) => {
	const [connectingTwitch, setConnectingTwitch] = useState(false);
	const [connectingCai, setConnectingCai] = useState(false);
	const { socket } = useContext(SocketContext) as SocketContextType;
	const { twitchCustomRedeems, caiVoices, caiAccountStatus, twitchAccountStatus } =
		useContext(HomeContext) as HomeContextType;
	const {
		twitchClientSecret,
		setTwitchClientSecret,
		twitchClientId,
		setTwitchClientId,
		twitchSelectedRedeem,
		setTwitchSelectedRedeem,
		caiAccessToken,
		setCaiAccessToken,
		caiCharacterId,
		setCaiCharacterId,
		caiSelectedVoice,
		setCaiSelectedVoice,
		caiBaseUrl,
		setCaiBaseUrl,
	} = useContext(ConfigContext) as ConfigContextType;

	const handleTwitchClientSecretChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTwitchClientSecret(event.target.value);
	};
	const handleTwitchClientIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTwitchClientId(event.target.value);
	};
	const handleTwitchSelectRedeem = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedRedeem = event.target.value;
		socket?.emit("twitchSelectRedeem", selectedRedeem);
		setTwitchSelectedRedeem(selectedRedeem);
	};
	const handleCaiAccessToken = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCaiAccessToken(event.target.value);
	};
	const handleCaiCharacterId = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCaiCharacterId(event.target.value);
	};
	const handleCaiBaseUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCaiBaseUrl(event.target.value);
	};
	const handleCaiSelectVoice = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedVoice = event.target.value;
		socket?.emit("caiSelectVoice", selectedVoice);
		setCaiSelectedVoice(parseInt(selectedVoice));
	};

	const authTwitch = () => {
		setConnectingTwitch(true);
		socket?.emit("twitchAuth", {
			client_secret: twitchClientSecret,
			client_id: twitchClientId,
		});
	};

	const authCai = () => {
		setConnectingCai(true);
		socket?.emit("caiAuth", {
			access_token: caiAccessToken,
			character_id: caiCharacterId,
			base_url: caiBaseUrl,
		});
	};

	return (
		<>
			<Row style={{ height: "50%" }}>
				<Col>
					<h1>Twitch config</h1>
					<hr className="hr" />
					<label className="fs-4">
						<strong>Client Secret</strong>
					</label>
					<InputGroup size="lg" className="mb-3">
						<Form.Control
							type="password"
							value={twitchClientSecret}
							onChange={handleTwitchClientSecretChange}
							placeholder="Client Secret"
							aria-label="Client Secret"
							aria-describedby="twitch-client-secret"
						/>
					</InputGroup>
					<label className="fs-4">
						<strong>Client ID</strong>
					</label>
					<InputGroup size="lg" className="mb-3">
						<Form.Control
							value={twitchClientId}
							onChange={handleTwitchClientIdChange}
							placeholder="Client ID"
							aria-label="Client ID"
							aria-describedby="twitch-client-secret"
						/>
					</InputGroup>
					<label className="fs-4">
						<strong>Redeems</strong>
					</label>
					<Form.Select
						size="lg"
						onChange={handleTwitchSelectRedeem}
						value={twitchSelectedRedeem}
						aria-label="Default select example"
					>
						{twitchCustomRedeems.map((redeem) => (
							<option key={redeem.id} value={redeem.id}>
								{redeem.title}
							</option>
						))}
					</Form.Select>
					<div className="d-grid gap-2 mt-4">
						{twitchAccountStatus ? (
							<Alert variant={"success"}>Connected</Alert>
						) : connectingTwitch ? (
							<Alert variant={"warning"}>Connecting...</Alert>
						) : (
							<Button onClick={authTwitch} variant="primary" size="lg">
								Connect
							</Button>
						)}
					</div>
				</Col>
				<Col md="auto">
					<div style={{ height: "100%" }} className="vr"></div>
				</Col>
				<Col>
					<h1>CAI config</h1>
					<hr className="hr" />
					<label className="fs-4">
						<strong>Access Token</strong>
					</label>
					<InputGroup className="mb-3" size="lg">
						<Form.Control
							type="password"
							value={caiAccessToken}
							onChange={handleCaiAccessToken}
							placeholder="Access Token"
							aria-label="Access Token"
							aria-describedby="cai-access-token"
						/>
					</InputGroup>
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
							aria-describedby="cai-character-id"
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
				</Col>
			</Row>
			<Row style={{ height: "50%" }}>
				<Col></Col>
				<Col md="auto">
					<div style={{ height: "100%" }} className="vr"></div>
				</Col>
				<Col></Col>
			</Row>
		</>
	);
};

export const ConfigPage = React.memo(ConfigPageComponent);
