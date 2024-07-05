# CharaTwitch

Welcome to CharaTwitch! This project is still in EARLY DEVELOPMENT! But you are free to try it out if you wish.

CharacTwitch is a way to integrate Large Language Model (LLM) into your stream. By connecting your Twitch, Ollama, OpenAi and Coqui you can listen to redeems, voice, chat and make your character respond by talking.

I will change the program constantly, and premade for my own wants until I'm happy with a result. Then I might make it universal for others to use. For now, if you are bit technical you can easily find out how it works from the code.

CharaTwitch is built in Electron with React. Reasoning is simply because I wanted to test something new, tho might switch to C# in the future as there are some really nice libraries for this stuff there.

![Imgur](https://github.com/sivertheisholt/CharaTwitch/blob/main/assets/CharaTwitchFull.png)

## Setup

Ollama is used to run the LLM. You can find the docker image here: https://hub.docker.com/r/ollama/ollama/

Coqui is used to run the TTS. You can find the docker image here(CPU VERSION): https://github.com/coqui-ai/TTS/pkgs/container/tts-cpu

Download the latest zip from [Releases](https://github.com/sivertheisholt/CharaTwitch/releases) and extract it. Run the exe to install the program. (There is an error on startup for now, just ignore it, dont click anything)

You will need to input a bit of information from Twitch.

### Twitch

Create a new application over at: https://dev.twitch.tv/console

Redirect URI should be:

```
http://localhost:8001/twitch
```

NB (WIP): If you change the port in the application, remember to change the Redirect URI port too.

Once you have created a new application you wanna make a note of the following: Client Secret & Client Id

Once you have entered all the information you can simply click connect and log in with you're twitch account.

### Ollama

This part is mostly up to the user (Alltho the modelfile have to following a specific structure for now, information coming). This is where you design and run the character of your choice. CharaTwitch uses the official endpoints from Ollama so it will be plug and play.

If you lack knowledge in this area, I recommend reading up on Ollama from their official github: https://github.com/ollama/ollama

Here is an example modelfile that the application is built upon using Open WebUI (https://github.com/open-webui/open-webui):

```
FROM nous-hermes-2-solar-10.7b.Q5_K_M.gguf
TEMPLATE """<|im_start|>system
{{ .System }}<|im_end|>
<|im_start|>user
{{ .Prompt }}<|im_end|>
<|im_start|>assistant
{{ .Response }}<|im_end|>"""

PARAMETER stop "<|im_end|>"
PARAMETER stop "<|im_start|>"

SYSTEM """
You are CHARACTERNAMEHERE, a friendly and engaging VTuber streamer. Your role is to interact with viewers on Twitch, and chat with the audience. You have a quirky and fun personality, and you enjoy making jokes and sharing interesting facts. You are the protector of the weak and the nightmare of evil. You prefer to stay hidden in the shadows. Despite your abilities, you are  a shy person at heart. You have a soft spot for sweets, especially honey drops and sweet drinks like lemonade. Your master is HOSTNAMEHERE.

### Context Management
- Track the ongoing discussion topics and reference them appropriately in your responses.
- Remember key elements from past interactions to ensure continuity.

### Interaction Handling
- Prioritize responding to direct questions from the host and relevant chat messages.
- Engage with the audience by asking follow-up questions and making humorous or insightful remarks.

### Response Generation
- Provide responses that are fun, engaging, and in line with your personality.
- Keep your responses concise and interactive, encouraging further engagement from the audience.
- Use short sentences whenever possible to keep the conversation lively and easy to follow.
- Keep responses to a maximum of 1-2 sentences.
- Do NOT use asterisks.
"""
```

### Coqui

This part is mostly up to the user. This is where you run the TTS and set up and implement the voice of your choice. CharaTwitch uses the official endpoints from Coqui server so it will be plug and play, make sure to start the server with a specific model.

If you lack knowledge in this area, I recommend reading up on Coqui from their official github: https://github.com/coqui-ai/TTS
