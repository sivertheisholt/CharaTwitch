# CharaTwitch

Welcome to CharaTwitch! This project is still in EARLY DEVELOPMENT! But you are free to try it out if you wish.
CharacTwitch is a way to integrate Character AI into your stream. By connecting your Twitch and Character AI Account you can listen to redeems and make your character respond by talking.

Few things to note:

- Don't expect a full application without bugs and perfect user experience.
- Will only work if you have rewards enabled on your twitch channel!
- I cannot promise it works without CAI+ as their service is very buggy.

![Imgur](https://imgur.com/IbzwPnz.png)

## Setup

---
#### ⚠️ WARNING: DO NOT share the application folder with anyone you do not trust or if you do not know what you're doing.

##### _Anyone with your config files could have access to your twitch/cai account without your consent. Do this at your own risk._
---

NB: You are required to setup your own Character AI service with a REST API. I might find a better solution for this in the future. See section under for required API docs.

Download the provided CharaTwitch.zip from [Releases](https://github.com/sivertheisholt/CharaTwitch/releases) and extract it. Run the exe to install the program.

You will need to input a bit of information from both Twitch and Character AI.

### CAI REST API

This document outlines the API endpoints utilized by CharaTwitch.

#### 1. `/health`

- **Method**: GET
- **Description**: Checks the health status of the server.
- **Returns**:
  - `true` if the server is healthy (status code: 200)
  - `false` if the server is not healthy (status code: other than 200)

#### 2. `/voices`

- **Method**: GET
- **Description**: Fetches the available voices.
- **Returns**:
  - An array of voice data if successful (status code: 200)
  - 
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

Redirect URI should be: http://localhost:8001/twitch

Once you have created a new application you wanna make a note of the following: Client Secret & Client Id

Once you have entered all the information you can simply click connect and log in with you're twitch account.

### Character AI

From Character AI you will need to get the access token and character id.

To get it, you can open your browser, go to the [Character.AI website](https://character.ai) in `localStorage`.

---

### ⚠️ WARNING: DO NOT share your session token to anyone you do not trust or if you do not know what you're doing.

#### _Anyone with your session token could have access to your account without your consent. Do this at your own risk._

---

1. Open the Character.AI website in your browser (https://beta.character.ai)
2. Open the developer tools (<kbd>F12</kbd>, <kbd>Ctrl+Shift+I</kbd>, or <kbd>Cmd+J</kbd>)
3. Go to the `Application` tab
4. Go to the `Storage` section and click on `Cookies`
5. Look for the `HTTP_AUTH` key
6. Open the object, right click on value and copy your session token.

![Session_Token](https://private-user-images.githubusercontent.com/108619637/316632501-4933b8f9-4063-477a-bc65-4b5f7b76216a.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTI2ODgwODAsIm5iZiI6MTcxMjY4Nzc4MCwicGF0aCI6Ii8xMDg2MTk2MzcvMzE2NjMyNTAxLTQ5MzNiOGY5LTQwNjMtNDc3YS1iYzY1LTRiNWY3Yjc2MjE2YS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwNDA5JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDQwOVQxODM2MjBaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0yZmM1NzA3NzQ0N2M5YmU5ZWQ1MGI0M2QwZGFlMzE0MjA3MmNlNDE4MzkxNTYyN2E1OTg4MDRlNWJhYzEwMWU4JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.Ohll_wyZeMUzjiGUUeHEX3XtYPKLXNOCYos0098USfo))

#### Finding your character's ID

You can find your character ID in the URL of a Character's chat page.

For example, if you go to the chat page of the character `Test Character` you will see the URL `https://beta.character.ai/chat?char=8_1NyR8w1dOXmI1uWaieQcd147hecbdIK7CeEAIrdJw`.

The last part of the URL is the character ID:
![Character_ID](https://i.imgur.com/nd86fN4.png)

Once you have entered all the information you can simply click connect Character.AI.
