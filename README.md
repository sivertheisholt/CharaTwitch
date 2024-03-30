# CharaTwitch

Welcome to CharaTwitch! This project is still in EARLY DEVELOPMENT! But you are free to try it out if you wish.
CharacTwitch is a way to integrate Character AI into your stream. By connecting your Twitch and Character AI Account you can listen to redeems and make your character respond by talking.

Few things to note:

- This is more of a demo to see whats possible with LLM (Large Language Model)
- Currently "untested" in production as I don't have a twitch with channel points.
- Don't expect a full application without bugs and perfect user experience.
- Will only work if you have rewards enabled on your twitch channel!
- If people like it, I might continue working on the project.
- I cannot promise it works without CAI+ as their service is very buggy.

### ⚠️ WARNING: DO NOT share the application folder with anyone you do not trust or if you do not know what you're doing.

![Imgur](https://imgur.com/IbzwPnz.png)

## Setup

NB: You are required to setup your own Character AI service with a REST API. I might find a better solution for this in the future.

Download the provided app.zip from [Releases](https://github.com/sivertheisholt/CharaTwitch/releases) and extract it. Run the exe to start the program.

You will need to input a bit of information from both Twitch and Character AI.

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
4. Go to the `Storage` section and click on `Local Storage`
5. Look for the `char_token` key
6. Open the object, right click on value and copy your session token.

![Session_Token](https://github.com/realcoloride/node_characterai/assets/108619637/1d46db04-0744-42d2-a6d7-35152b967a82)

#### Finding your character's ID

You can find your character ID in the URL of a Character's chat page.

For example, if you go to the chat page of the character `Test Character` you will see the URL `https://beta.character.ai/chat?char=8_1NyR8w1dOXmI1uWaieQcd147hecbdIK7CeEAIrdJw`.

The last part of the URL is the character ID:
![Character_ID](https://i.imgur.com/nd86fN4.png)

Once you have entered all the information you can simply click connect Character.AI.
