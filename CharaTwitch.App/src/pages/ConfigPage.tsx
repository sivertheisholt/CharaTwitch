import React, { useContext } from "react";
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

export interface ConfigPageProps {}

const ConfigPageComponent = (props: ConfigPageProps) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const { twitchCustomRedeems, caiVoices } = useContext(HomeContext) as HomeContextType;
	const {
		twitchClientSecret,
		setTwitchClientSecret,
		twitchClientId,
		setTwitchClientId,
		twitchTriggerWord,
		setTwitchtriggerWord,
		twitchListenToTriggerWord,
		setTwitchListenToTriggerWord,
		twitchSelectedRedeem,
		setTwitchSelectedRedeem,
		caiAccessToken,
		setCaiAccessToken,
		caiCharacterId,
		setCaiCharacterId,
		caiSelectedVoice,
		setCaiSelectedVoice,
	} = useContext(ConfigContext) as ConfigContextType;

	const handleTwitchClientSecretChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTwitchClientSecret(event.target.value);
	};
	const handleTwitchClientIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTwitchClientId(event.target.value);
	};
	const handleTwitchTriggerWordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTwitchtriggerWord(event.target.value);
	};
	const handleTwitchListenToTriggerWord = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setTwitchListenToTriggerWord(event.target.checked);
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
	const handleCaiSelectVoice = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedVoice = event.target.value;
		console.log(selectedVoice);
		socket?.emit("caiSelectVoice", selectedVoice);
		setCaiSelectedVoice(parseInt(selectedVoice));
	};

	const authTwitch = () => {
		socket?.emit("twitchAuth", {
			client_secret: twitchClientSecret,
			client_id: twitchClientId,
			trigger_word: twitchTriggerWord,
			listen_to_trigger_word: twitchListenToTriggerWord,
		});
	};

	const authCai = () => {
		socket?.emit("caiAuth", {
			access_token: caiAccessToken,
			character_id: caiCharacterId,
		});
	};

	return (
		<>
			<Row style={{ height: "50%" }}>
				<Col>
					<h1>Twitch config</h1>
					<hr className="hr" />
					<InputGroup size="lg" className="mb-3">
						<InputGroup.Text id="twitch-client-secret">Client secret</InputGroup.Text>
						<Form.Control
							value={twitchClientSecret}
							onChange={handleTwitchClientSecretChange}
							aria-label="Small"
							aria-describedby="twitch-client-secret"
						/>
					</InputGroup>
					<InputGroup size="lg" className="mb-3">
						<InputGroup.Text id="twitch-client-id">Client id</InputGroup.Text>
						<Form.Control
							value={twitchClientId}
							onChange={handleTwitchClientIdChange}
							aria-label="Small"
							aria-describedby="twitch-client-secret"
						/>
					</InputGroup>
					<InputGroup size="lg" className="mb-3">
						<InputGroup.Text id="twitch-trigger-word">Trigger word</InputGroup.Text>
						<Form.Control
							value={twitchTriggerWord}
							onChange={handleTwitchTriggerWordChange}
							aria-label="Small"
							aria-describedby="twitch-trigger-word"
						/>
					</InputGroup>

					<Form.Check
						checked={twitchListenToTriggerWord}
						onChange={handleTwitchListenToTriggerWord}
						type="switch"
						id="custom-switch"
						label="Listen to trigger word"
					/>
					<Form.Select
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
					<div className="d-grid gap-2">
						<Button onClick={authTwitch} variant="primary" size="lg">
							Connect
						</Button>
					</div>
				</Col>
				<Col md="auto">
					<div style={{ height: "100%" }} className="vr"></div>
				</Col>
				<Col>
					<h1>CAI config</h1>
					<hr className="hr" />
					<InputGroup className="mb-3">
						<InputGroup.Text id="cai-access-token">Access token</InputGroup.Text>
						<Form.Control
							value={caiAccessToken}
							onChange={handleCaiAccessToken}
							placeholder="Username"
							aria-label="Username"
							aria-describedby="cai-access-token"
						/>
					</InputGroup>
					<InputGroup className="mb-3">
						<InputGroup.Text id="cai-character-id">Character ID</InputGroup.Text>
						<Form.Control
							value={caiCharacterId}
							onChange={handleCaiCharacterId}
							placeholder="Username"
							aria-label="Username"
							aria-describedby="cai-character-id"
						/>
					</InputGroup>
					<Form.Select
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
					<div className="d-grid gap-2">
						<Button onClick={authCai} variant="primary" size="lg">
							Connect
						</Button>
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
