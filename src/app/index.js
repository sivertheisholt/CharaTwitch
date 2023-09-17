require("dotenv").config()
const CharacterAI = require('node_characterai');
const characterAI = new CharacterAI();
const fs = require('fs');

const setupBtn = document.getElementById('setup_characterai');
const characterAiAccessTokenInput = document.getElementById("character_ai_access_token")
const caiCharacterIdInput = document.getElementById("character_ai_character_id")
const fetchTtsBtn = document.getElementById("fetch_tts");
const fetchTtsTextBtn = document.getElementById("fetch_tts_text");
const caiConnectBtn = document.getElementById("character_ai_connect");

fs.readFile("auth", "utf8", (err, data) => {
    if(err) return console.log(err);

    characterAiAccessTokenInput.value = data;
});

async function setupCai() {
    characterAI.requester.usePlus = true;
    characterAI.requester.forceWaitingRoom = false;
    await characterAI.authenticateWithToken(characterAiAccessTokenInput.value);
    fs.writeFile("auth", characterAiAccessTokenInput.value, function(err) {
        if(err) return console.log(err);

        console.log("The file was saved!");
    });
    console.log("Cai authenticated");
}

async function playTTS(text)
{
    try {
        var res = await characterAI.fetchTTS(22, text);
        new Audio(`data:audio/wav;base64,${res}`).play()
    } catch (error) {
        console.log(error);
    }
}


async function authCai()
{
    var win = nw.Window.get();
    // Create a new window and get it
    nw.Window.open('https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=ts6ukgqnj4vu12wjtsjstyjo9shjzi&redirect_uri=http://localhost&scope=chat%3Aread+chat%3Aedit&state=c3ab8aa609ea11e793ae92361f002671', {}, function(new_win) {
        // And listen to new window's focus event
        new_win.on('focus', function() {
            console.log('New window is focused');
            fs.writeFile("test", "hi", function(err) {
                if(err) return console.log(err);
        
                console.log("The file was saved!");
            });
        });
        nw.Window.get().on('navigation', function(frame, url, policy) {
            // do not open the window
            policy.ignore();
            // and open it in external browser
            nw.Shell.openExternal(url);
          });
    })
}

setupBtn.addEventListener('click', () => setupCai());
fetchTtsBtn.addEventListener("click", () => playTTS(fetchTtsTextBtn.value));
caiConnectBtn.addEventListener("click", () => authCai())