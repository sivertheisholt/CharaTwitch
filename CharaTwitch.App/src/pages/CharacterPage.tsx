import React, { useContext } from "react";
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
	} = useContext(CharacterContext) as CharacterContextType;

	const handleRandomRedeemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCharacterRandomRedeems(event.target.checked);
	};
	const handleRandomTalkingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCharacterRandomTalking(event.target.checked);
	};
	const handleWelcomeStrangersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCharacterWelcomeStrangers(event.target.checked);
	};
	const handleWelcomeRaidersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCharacterWelcomeRaiders(event.target.checked);
	};
	const handleRandomRedeemFrequencyChange = (value: number) => {
		setCharacterRandomRedeemsFrequency(value);
	};
	const handleRandomTalkingFrequencyChange = (value: number) => {
		setCharacterRandomTalkingFrequency(value);
	};
	const handleContextParamChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCharacterContextParameter(event.target.value);
	};
	const handleIntroParamChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCharacterIntroParam(event.target.value);
	};
	const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCharacterQuestion(event.target.value);
	};

	return (
		<>
			<Row className="h-100">
				<Col>
					<h1>Actions</h1>
					<hr className="hr" />
					<Card className="mb-2" data-bs-theme="dark">
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
							>
								<option>A message from chad</option>
							</Form.Select>
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
									as="textarea"
									placeholder="What to ask"
									value={characterQuestion}
									onChange={handleQuestionChange}
								/>
							</InputGroup>
							<div className="d-grid gap-2 mt-4">
								<Button variant="primary" size="sm">
									Ask question
								</Button>
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
									as="textarea"
									placeholder="Message sent for character to respond to"
									value={characterIntroParam}
									onChange={handleIntroParamChange}
								/>
							</InputGroup>
							<div className="d-grid gap-2 mt-4">
								<Button variant="primary" size="sm">
									Do intro
								</Button>
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
											<strong>Random redeems</strong>
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
							</Container>
						</Card.Body>
					</Card>

					<Card className="mb-2" data-bs-theme="dark">
						<Card.Body>
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

							<label className="fs-6 mt-4">
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
									value={characterContextParameter}
									onChange={handleContextParamChange}
									placeholder="This message was sent by ${username} - context is that multiple people are using you to chat in a chatroom using your API.  You shall respond excited and express your feelings the most you can.  You should remember conversations with different people. You should always reply with several sentences. You should not include this in the response, this is only for context."
								/>
							</InputGroup>
							<Button className="w-100" variant="primary" size="sm">
								Save
							</Button>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export const CharacterPage = React.memo(CharacterPageComponent);
