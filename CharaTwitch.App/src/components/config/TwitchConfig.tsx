import React, { useContext, useState } from "react";
import { TwitchConfigContext } from "../../contexts/config/TwitchConfigContext";
import { TwitchConfigContextType } from "../../types/context/config/TwitchConfigContextType";
import { SocketContextType } from "../../types/context/SocketContextType";
import { SocketContext } from "../../contexts/SocketContext";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import { TwitchDashboardContext } from "../../contexts/dashboard/TwitchDashboardContext";
import { TwitchDashboardContextType } from "../../types/context/dashboard/TwitchDashboardContextType";
import { TWITCH_AUTH, TWITCH_SELECTED_REDEEM_CHANGE } from "../../socket/TwitchEvents";

export interface TwitchConfigProps {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TwitchConfigComponent = (props: TwitchConfigProps) => {
	const [connectingTwitch, setConnectingTwitch] = useState(false);
	const { socket } = useContext(SocketContext) as SocketContextType;
	const { twitchAccountStatus } = useContext(TwitchDashboardContext) as TwitchDashboardContextType;

	const {
		twitchClientSecret,
		setTwitchClientSecret,
		twitchClientId,
		setTwitchClientId,
		twitchSelectedRedeem,
		setTwitchSelectedRedeem,
		twitchCustomRedeems,
	} = useContext(TwitchConfigContext) as TwitchConfigContextType;

	const handleTwitchClientSecretChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTwitchClientSecret(event.target.value);
	};
	const handleTwitchClientIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTwitchClientId(event.target.value);
	};
	const handleTwitchSelectRedeem = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedRedeem = event.target.value;
		socket?.emit(TWITCH_SELECTED_REDEEM_CHANGE, selectedRedeem);
		setTwitchSelectedRedeem(selectedRedeem);
	};

	const authTwitch = () => {
		setConnectingTwitch(true);
		socket?.emit(TWITCH_AUTH, {
			client_secret: twitchClientSecret,
			client_id: twitchClientId,
		});
	};

	return (
		<>
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
		</>
	);
};

export const TwitchConfig = React.memo(TwitchConfigComponent);
