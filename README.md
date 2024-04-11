# CharaTwitch

Welcome to CharaTwitch! This project is still in EARLY DEVELOPMENT! But you are free to try it out if you wish.
CharacTwitch is a way to integrate Character AI into your stream. By connecting your Twitch and Character AI Account you can listen to redeems and make your character respond by talking.

Few things to note:

- Don't expect a full application without bugs and perfect user experience.
- Will only work if you have rewards enabled on your twitch channel!
- I cannot promise it works without CAI+ as their service is very buggy.

![Imgur](https://github.com/sivertheisholt/CharaTwitch/blob/main/assets/CharaTwitchFull.png)

## Setup

NB: You are required to setup your own Character AI service with a REST API. I might find a better solution for this in the future. See section under for required API docs.

Download the provided CharaTwitch.zip from [Releases](https://github.com/sivertheisholt/CharaTwitch/releases) and extract it. Run the exe to install the program.

You will need to input a bit of information from both Twitch and Character AI.

### CAI REST API

This document outlines the API endpoints utilized by CharaTwitch.
You can find/use my own implementation here: https://github.com/sivertheisholt/CustomCharacterAi

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

#### 4. `/chat`

- **Method**: POST
- **Description**: Sends a chat message.
- **Parameters**:
  - `character_id`: ID of the character
  - `text`: Message text
- **Returns**:
  - Response data if successful (status code: 200)

### Twitch

Create a new application over at: https://dev.twitch.tv/console

Redirect URI's should be: 
```
http://localhost:8001/twitch

http://localhost:8001/twitch2
```
Once you have created a new application you wanna make a note of the following: Client Secret & Client Id

Once you have entered all the information you can simply click connect and log in with you're twitch account.

### Character AI

From Character AI you will need to get the character id and server base URL. Once you have filled in everything, click connect and log in to character AI in the window that pops up.

Once logged in, navigate to a random chat (This is to force the page to set the HTTP_AUTHORIZATION cookie needed)

#### Finding your character's ID

You can find your character ID in the URL of a Character's chat page.

For example, if you go to the chat page of the character `Test Character` you will see the URL `https://character.ai/chat/T9ZeWjFhG6wovhXSWcuxsX310Oj2H6NJnYxH2JJAgu8`.

The last part of the URL is the character ID:

Once you have entered all the information you can simply click connect Character.AI.
