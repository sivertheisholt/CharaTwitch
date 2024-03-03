import React, { useContext } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { StatusCard } from "../components/cards/StatusCard";
import Alert from "react-bootstrap/esm/Alert";
import { v4 as uuidv4 } from "uuid";
import { HomeContext } from "../contexts/HomeContext";
import { HomeContextType } from "../types/HomeContextType";

export interface HomePageProps {}

const HomePageComponent = (props: HomePageProps) => {
	const {
		twitchMessages,
		twitchRedeems,
		twitchIrcStatus,
		twitchPubSubStatus,
		twitchAccountStatus,
		caiAccountStatus,
		caiMessages,
	} = useContext(HomeContext) as HomeContextType;
	return (
		<>
			<Row style={{ height: "20%" }}>
				<Col>
					<Row
						className=" justify-content-center align-items-center"
						style={{ flexWrap: "nowrap", height: "100%" }}
					>
						<Col>
							<StatusCard
								active={twitchAccountStatus}
								title="Twitch Account"
								pngName="twitch-logo.png"
							/>
						</Col>
						<Col>
							<StatusCard
								active={twitchIrcStatus}
								title="Twitch IRC"
								pngName="twitch-logo.png"
							/>
						</Col>
						<Col>
							<StatusCard
								active={twitchPubSubStatus}
								title="Twitch Redeems"
								pngName="twitch-logo.png"
							/>
						</Col>
						<Col>
							<StatusCard
								active={caiAccountStatus}
								title="Character AI"
								pngName="cai.ico"
							/>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row style={{ height: "40%" }}>
				<Col style={{ height: "100%", overflowY: "auto" }}>
					<h1>Twitch chat</h1>
					<hr className="hr" />
					{twitchMessages.map((twitch) => (
						<Alert key={uuidv4()} variant={"primary"}>
							{twitch.username}: {twitch.message}
						</Alert>
					))}
				</Col>
				<Col md="auto">
					<div style={{ height: "100%" }} className="vr"></div>
				</Col>
				<Col style={{ height: "100%", overflowY: "auto" }}>
					<h1>Twitch Redeems</h1>
					<hr className="hr" />
					{twitchRedeems.map((redeem) => (
						<Alert key={uuidv4()} variant={"primary"}>
							{redeem.username}: {redeem.reward}
						</Alert>
					))}
				</Col>
			</Row>
			<Row style={{ height: "40%" }}>
				<Col style={{ height: "100%", overflowY: "auto" }}>
					<h1>Character AI</h1>
					<hr className="hr" />
					{caiMessages.map((message) => (
						<Alert key={uuidv4()} variant={"primary"}>
							{message}
						</Alert>
					))}
				</Col>
				<Col md="auto">
					<div style={{ height: "100%" }} className="vr"></div>
				</Col>
				<Col>
					<h1>Status</h1>
					<hr className="hr" />
					<h1>Processing request...</h1>
				</Col>
			</Row>
		</>
	);
};

export const HomePage = React.memo(HomePageComponent);
