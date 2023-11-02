# CharaTwitch

Welcome to CharaTwitch! This project is still in EARLY DEVELOPMENT! But you are free to try it out if you wish.

CharacTwitch is a way to integrate Character AI into your stream. By connecting your twitch and Character AI Account you can listen to chat and make your character respond by talking.

![Imgur](https://i.imgur.com/fwAsbyP.png)

## Setup

Download the provided app.zip from [Releases](https://github.com/sivertheisholt/CharaTwitch/releases) and extract it. Run src.exe to start the program.

You will need to input a bit of information from both Twitch and Character AI. 

### Twitch

Create a new application over at: https://dev.twitch.tv/console

Redirect URI should be: http://localhost:3000/twitch

Once you have created a new application you wanna make a note of the following: Client Secret & Client Id

Once you have entered all the information you can simply click Connect Twitch and log in with you're twitch account.

### Character AI

From Character AI you will need to get the access token and character id.

Open your browser, go to the [Character.AI website](https://character.ai) in `localStorage`.

To do so:
1. Open the Character.AI website in your browser (https://beta.character.ai)
2. Open the developer tools (<kbd>F12</kbd>, <kbd>Ctrl+J</kbd>, or <kbd>Cmd+J</kbd>)
3. Go to the `Application` tab
4. Go to the `Storage` section and click on `Local Storage`
5. Look for the `@@auth0spajs@@::dyD3gE281MqgISG7FuIXYhL2WEknqZzv::https://auth0.character.ai/::openid profile email offline_access` key
6. Open the body with the arrows and copy the access token (Make sure to get the full token! It's pretty long)

![Access_Token](https://i.imgur.com/09Q9mLe.png)

#### Finding your character's ID

You can find your character ID in the URL of a Character's chat page.

For example, if you go to the chat page of the character `Test Character` you will see the URL `https://beta.character.ai/chat?char=8_1NyR8w1dOXmI1uWaieQcd147hecbdIK7CeEAIrdJw`.

The last part of the URL is the character ID:
![Character_ID](https://i.imgur.com/nd86fN4.png)

#### Connect

Once you have entered all the information you can simply click Connect Character.AI. Sometimes this will hang and get stuck, unfortunately the only solution is to simply restart the application and try again for now.
