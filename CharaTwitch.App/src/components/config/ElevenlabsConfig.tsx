import React, { useContext } from "react";
import Form from "react-bootstrap/esm/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";
import { ElevenlabsConfigContextType } from "../../types/context/config/ElevenlabsConfigContextType";
import { ElevenlabsConfigContext } from "../../contexts/config/ElevenlabsConfigContext";
import { ELEVENLABS_SELECTED_VOICE_CHANGE } from "../../socket/ElevenlabsEvents";
import { SocketContext } from "../../contexts/SocketContext";
import { SocketContextType } from "../../types/context/SocketContextType";

export interface ElevenlabsConfigProps {}

const ElevenlabsConfigComponent = (props: ElevenlabsConfigProps) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const {
		elevenlabsApiKey,
		setElevenlabsApiKey,
		elevenlabsVoices,
		elevenlabsSelectedVoice,
		setElevenlabsSelectedVoice,
	} = useContext(ElevenlabsConfigContext) as ElevenlabsConfigContextType;

	const handleOllamaApiKey = (event: React.ChangeEvent<HTMLInputElement>) => {
		setElevenlabsApiKey(event.target.value);
	};

	const handleElevenlabsSelectVoice = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedRedeem = event.target.value;
		socket?.emit(ELEVENLABS_SELECTED_VOICE_CHANGE, selectedRedeem);
		setElevenlabsSelectedVoice(selectedRedeem);
	};

	return (
		<>
			<h2>ElevenLabs</h2>
			<hr className="hr" />
			<label className="fs-4">
				<strong>API Key</strong>
			</label>
			<InputGroup className="mb-3" size="lg">
				<Form.Control
					value={elevenlabsApiKey}
					onChange={handleOllamaApiKey}
					placeholder="Model Name"
					aria-label="Model Name"
					type="password"
				/>
			</InputGroup>
			<label className="fs-4">
				<strong>Redeems</strong>
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
		</>
	);
};

export const ElevenlabsConfig = React.memo(ElevenlabsConfigComponent);
