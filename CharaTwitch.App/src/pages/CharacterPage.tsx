import React, { useContext, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Row from "react-bootstrap/esm/Row";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { CharacterContext } from "../contexts/CharacterContext";
import { CharacterContextType } from "../types/CharacterContextType";
import { SocketContext } from "../contexts/SocketContext";
import { SocketContextType } from "../types/SocketContextType";
import {
	CHARACTER_WELCOME_RAIDERS_CHANGE,
	CHARACTER_WELCOME_STRANGERS_CHANGE,
	CHARACTER_RANDOM_REDEEMS_CHANGE,
	CHARACTER_RANDOM_TALKING_CHANGE,
	CHARACTER_RANDOM_REDEEMS_FREQUENCY_CHANGE,
	CHARACTER_RANDOM_TALKING_FREQUENCY_CHANGE,
	CHARACTER_DO_INTRO,
	CHARACTER_ASK_QUESTION,
	CHARACTER_CONTEXT_PARAMETER,
	CHARACTER_WELCOME_NEW_VIEWERS_CHANGE,
} from "../socket/Events";
import Alert from "react-bootstrap/esm/Alert";

export interface CharacterPageProps {}

const CharacterPageComponent = (props: CharacterPageProps) => {
	const {
		characterSelectedRedeem,
		setCharacterSelectedRedeem,
		characterQuestion,
		setCharacterQuestion,
		characterIntroParam,
		setCharacterIntroParam,
		characterRandomRedeems,
		setCharacterRandomRedeems,
		characterRandomTalking,
		setCharacterRandomTalking,
		characterWelcomeStrangers,
		setCharacterWelcomeStrangers,
		characterWelcomeRaiders,
		setCharacterWelcomeRaiders,
		characterRandomRedeemsFrequency,
		setCharacterRandomRedeemsFrequency,
		characterRandomTalkingFrequency,
		setCharacterRandomTalkingFrequency,
		characterContextParameter,
		setCharacterContextParameter,
		characterWelcomeNewViewers,
		setCharacterWelcomeNewViewers,
	} = useContext(CharacterContext) as CharacterContextType;
	const { socket } = useContext(SocketContext) as SocketContextType;

	const [saveContext, setSaveContext] = useState(false);
	const [startIntro, setStartIntro] = useState(false);
	const [startQuestion, setStartQuestion] = useState(false);

	const handleRandomRedeemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked;
		socket.emit(CHARACTER_RANDOM_REDEEMS_CHANGE, checked);
		setCharacterRandomRedeems(checked);
	};
	const handleRandomTalkingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked;
		socket.emit(CHARACTER_RANDOM_TALKING_CHANGE, checked);
		setCharacterRandomTalking(checked);
	};
	const handleWelcomeStrangersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked;
		socket.emit(CHARACTER_WELCOME_STRANGERS_CHANGE, checked);
		setCharacterWelcomeStrangers(checked);
	};
	const handleWelcomeRaidersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked;
		socket.emit(CHARACTER_WELCOME_RAIDERS_CHANGE, checked);
		setCharacterWelcomeRaiders(checked);
	};
	const handleWelcomeNewViewersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked;
		socket.emit(CHARACTER_WELCOME_NEW_VIEWERS_CHANGE, checked);
		setCharacterWelcomeNewViewers(checked);
	};
	const handleRandomRedeemFrequencyChange = (value: number) => {
		socket.emit(CHARACTER_RANDOM_REDEEMS_FREQUENCY_CHANGE, value);
		setCharacterRandomRedeemsFrequency(value);
	};
	const handleRandomTalkingFrequencyChange = (value: number) => {
		socket.emit(CHARACTER_RANDOM_TALKING_FREQUENCY_CHANGE, value);
		setCharacterRandomTalkingFrequency(value);
	};
	const handleContextParamChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setCharacterContextParameter(value);
	};
	const handleIntroParamChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setCharacterIntroParam(value);
	};
	const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setCharacterQuestion(value);
	};
	const handleSelectRedeem = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedRedeem = event.target.value;
		setCharacterSelectedRedeem(selectedRedeem);
	};

	const handleDoIntro = () => {
		socket.emit(CHARACTER_DO_INTRO, characterIntroParam);
		setStartIntro(true);
		setTimeout(() => setStartIntro(false), 5000);
	};

	const handleAskQuestion = () => {
		socket.emit(CHARACTER_ASK_QUESTION, characterQuestion);
		setStartQuestion(true);
		setTimeout(() => setStartQuestion(false), 5000);
	};

	const handleSaveContextParam = () => {
		socket.emit(CHARACTER_CONTEXT_PARAMETER, characterContextParameter);
		setSaveContext(true);
		setTimeout(() => setSaveContext(false), 3000);
	};

	return (
		<>
			<Row className="h-100">
				<Col>
					<h1>Actions</h1>
					<hr className="hr" />
					<Card style={{ display: "none" }} className="mb-2" data-bs-theme="dark">
						<Card.Body>
							<label className="fs-6">
								<strong>Redeems</strong>
							</label>
							<Form.Select
								className="mb-2"
								data-bs-theme="light"
								size="sm"
								aria-label="Default select example"
								value={characterSelectedRedeem}
								onChange={handleSelectRedeem}
							></Form.Select>
							<div className="d-flex justify-content-center">
								<Button className="w-100" variant="primary" size="sm">
									Redeem selected
								</Button>
								<Button className="ms-2 w-100" variant="primary" size="sm">
									Redeem random
								</Button>
							</div>
						</Card.Body>
					</Card>

					<Card className="mb-2" data-bs-theme="dark">
						<Card.Body>
							<label className="fs-6">
								<strong>Question</strong>
							</label>
							<InputGroup className="mb-3" size="sm">
								<Form.Control
									data-bs-theme="light"
									style={{ height: "100px" }}
									as="textarea"
									placeholder="Question"
									maxLength={250}
									value={characterQuestion}
									onChange={handleQuestionChange}
								/>
							</InputGroup>
							<div className="d-grid gap-2 mt-4">
								{startQuestion ? (
									<Alert variant={"success"}>Started!</Alert>
								) : (
									<Button variant="primary" size="sm" onClick={handleAskQuestion}>
										Ask question
									</Button>
								)}
							</div>
						</Card.Body>
					</Card>

					<Card data-bs-theme="dark">
						<Card.Body>
							<label className="fs-6">
								<strong>Intro param</strong>
							</label>
							<InputGroup className="mb-3" size="sm">
								<Form.Control
									data-bs-theme="light"
									style={{ height: "100px" }}
									as="textarea"
									placeholder="Text to speech"
									maxLength={1000}
									value={characterIntroParam}
									onChange={handleIntroParamChange}
								/>
							</InputGroup>
							<div className="d-grid gap-2 mt-4">
								{startIntro ? (
									<Alert variant={"success"}>Started!</Alert>
								) : (
									<Button variant="primary" size="sm" onClick={handleDoIntro}>
										Do intro
									</Button>
								)}
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col md="auto">
					<div className="vr h-100"></div>
				</Col>
				<Col>
					<h1>Behavior</h1>
					<hr className="hr" />

					<Card className="mb-2" data-bs-theme="dark">
						<Card.Body>
							<Container>
								<Row>
									<Col>
										<label className="fs-6">
											<strong>Random redeems (OFF)</strong>
										</label>
										<InputGroup data-bs-theme="light" className="mb-3" size="sm">
											<Form.Check
												onChange={handleRandomRedeemChange}
												checked={characterRandomRedeems}
											/>
										</InputGroup>
									</Col>
									<Col>
										<label className="fs-6">
											<strong>Random talking</strong>
										</label>
										<InputGroup data-bs-theme="light" className="mb-3" size="lg">
											<Form.Check
												onChange={handleRandomTalkingChange}
												checked={characterRandomTalking}
											/>
										</InputGroup>
									</Col>
								</Row>
								<Row>
									<Col>
										<label className="fs-6">
											<strong>Welcome strangers</strong>
										</label>
										<InputGroup data-bs-theme="light" className="mb-3" size="sm">
											<Form.Check
												onChange={handleWelcomeStrangersChange}
												checked={characterWelcomeStrangers}
											/>
										</InputGroup>
									</Col>
									<Col>
										<label className="fs-6">
											<strong>Welcome raiders</strong>
										</label>
										<InputGroup data-bs-theme="light" className="mb-3" size="sm">
											<Form.Check
												onChange={handleWelcomeRaidersChange}
												checked={characterWelcomeRaiders}
											/>
										</InputGroup>
									</Col>
								</Row>
								<Row>
									<Col>
										<label className="fs-6">
											<strong>Welcome new viewers</strong>
										</label>
										<InputGroup data-bs-theme="light" className="mb-3" size="sm">
											<Form.Check
												onChange={handleWelcomeNewViewersChange}
												checked={characterWelcomeNewViewers}
											/>
										</InputGroup>
									</Col>
								</Row>
							</Container>
						</Card.Body>
					</Card>

					<Card className="mb-2" data-bs-theme="dark">
						<Card.Body>
							<div style={{ display: "none", margin: 0, padding: 0 }}>
								<label className="fs-6">
									<strong>Redeems frequency</strong>
								</label>
								<Slider
									className="h-100 w-100 mt-2"
									max={100}
									min={0}
									step={5}
									value={characterRandomRedeemsFrequency}
									onChange={handleRandomRedeemFrequencyChange}
								/>
							</div>

							<label className="fs-6">
								<strong>Talking frequency</strong>
							</label>
							<Slider
								className="h-100 w-100 mt-2"
								max={100}
								min={0}
								step={5}
								value={characterRandomTalkingFrequency}
								onChange={handleRandomTalkingFrequencyChange}
							/>
						</Card.Body>
					</Card>

					<Card data-bs-theme="dark">
						<Card.Body>
							<label className="fs-6">
								<strong>Context parameter</strong>
							</label>
							<p>Variables available: {"${username}"}</p>
							<InputGroup className="mb-3" size="sm">
								<Form.Control
									style={{ height: "200px" }}
									data-bs-theme="light"
									as="textarea"
									maxLength={500}
									value={characterContextParameter}
									onChange={handleContextParamChange}
									placeholder="This message was sent by ${username} - context is that multiple people are using you to chat in a chatroom using your API.  You shall respond excited and express your feelings the most you can.  You should remember conversations with different people. You should always reply with several sentences. You should not include this in the response, this is only for context."
								/>
							</InputGroup>
							{saveContext ? (
								<Alert variant={"success"}>Saved!</Alert>
							) : (
								<Button
									className="w-100"
									variant="primary"
									size="sm"
									onClick={handleSaveContextParam}
								>
									Save
								</Button>
							)}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export const CharacterPage = React.memo(CharacterPageComponent);
