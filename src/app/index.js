require("dotenv").config()
const CharacterAI = require('node_characterai');
const characterAI = new CharacterAI();

const rulesBtn = document.getElementById('setup_characterai');

async function setup() {
    characterAI.requester.usePlus = true;
    characterAI.requester.forceWaitingRoom = false;
    console.log("Authenticating")
    try {
        let auth = await characterAI.authenticateWithToken(process.env.ACCESS_TOKEN);
        console.log(auth)
    } catch (error) {
        console.log(error);
    }
}

setup();

async function getTTS()
{
    try {
        let res = await characterAI.fetchTTS(10, "Hello there my friend");
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}

rulesBtn.addEventListener('click', () => getTTS());