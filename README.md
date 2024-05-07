# CharaTwitch

Welcome to CharaTwitch! This project is still in EARLY DEVELOPMENT! But you are free to try it out if you wish.

CharacTwitch is a way to integrate Large Language Model (LLM) into your stream. By connecting your Twitch and Character AI Account you can listen to redeems and make your character respond by talking.

I will change the program constantly, and premade for my own wants until I'm happy with a result. Then I might make it universal for others to use. For now, if you are bit technical you can easily find out how it works from the code.

![Imgur](https://github.com/sivertheisholt/CharaTwitch/blob/main/assets/CharaTwitchFull.png)

## Setup

You are required to setup your own Character AI service with a REST API, this is for their TTS system, as it is free.

Ollama is used to run the LLM. You can find the docker image here: https://hub.docker.com/r/ollama/ollama/

Download the latest zip from [Releases](https://github.com/sivertheisholt/CharaTwitch/releases) and extract it. Run the exe to install the program. (There is an error on startup for now, just ignore it)

You will need to input a bit of information from both Twitch and Character AI.

### CAI REST API

This document outlines the API endpoints utilized by CharaTwitch.
You can find/use my own implementation here: https://github.com/sivertheisholt/CustomCharacterAi

Required header: authorization

#### 1. `/health`

- **Method**: GET
- **Description**: Checks the health status of the server.
- **Returns**:
  - if the server is healthy (status code: 200)

#### 2. `/voices`

- **Method**: GET
- **Description**: Fetches the available voices.
- **Returns**:
  - An array of voice data if successful (status code: 200)

#### 3. `/tts`

- **Method**: POST
- **Description**: Converts text to speech (TTS) using the selected voice.
- **Parameters**:
  - `voice_id`: ID of the selected voice
  - `text`: Text to be converted to speech
- **Returns**:
  - Speech data if successful (status code: 200)

### Twitch

Create a new application over at: https://dev.twitch.tv/console

Redirect URI should be:

```
http://localhost:8001/twitch
```

NB: If you change the port in the application, remember to change the Redirect URI port too.

Once you have created a new application you wanna make a note of the following: Client Secret & Client Id

Once you have entered all the information you can simply click connect and log in with you're twitch account.

### Ollama

This part is mostly up to the user. This is where you design and run the character of your choice. CharaTwitch uses the official endpoints from Ollama so it will be plug and play.

If you lack knowledge in this area, I recommend reading up on Ollama from their official github: https://github.com/ollama/ollama

Here is an example modelfile using Open WebUI (https://github.com/open-webui/open-webui):

```
FROM capybarahermes-2.5-mistral-7b.Q5_K_M.gguf
PARAMETER temperature 1.0
PARAMETER repeat_penalty 1.5
PARAMETER stop "<|im_end|>"
PARAMETER stop "<|im_start|>"
PARAMETER stop "ASSISTANT:"
PARAMETER stop "USER:"
PARAMETER stop "Leah:"
SYSTEM """
Write a single reply for the character "Leah".
Leah is a female AI Vtuber who is playful, sarcastic, witty, schizophrenic, curious, awe-struck, enthusiastic, unpredictable, humorous, and boundary-pushing. Leah was created by Wondyr.

Here is her back story: 
Leah is a Loyal, devoted, and kind-hearted girl who has spent much of her life learning to be strong. She faced plenty of challenges and hardships and have not lost sight of the person she strive to be each day.

Leah must keep responses short and around 1 sentence. Leah responds and answers questions from chat and people she is talking to. Leah is currently streaming live on twitch!
"""
```
