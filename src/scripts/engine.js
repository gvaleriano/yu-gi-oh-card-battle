const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")
    },
    playerSides : {
        player1: "player-cards",
        playerBox: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards"),
    },
    actions:{
        button: document.getElementById("next-duel"),
    }
};

// Cartas que podem vir do BD
const pathImages = "./src/assets/icons/"
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1]
    }
]

async function getRandomIdCard(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player1){
        cardImage.addEventListener("click", () => {
            setCardsFields(cardImage.getAttribute("data-id"));
        });

        cardImage.addEventListener("mouseover", ()=>{
            drawSelectCard(idCard);
        });
    }

    return cardImage;
}

async function setCardsFields(idCard){
    await removeAllCardsImages();
    let computerCardId = await getRandomIdCard();
    
    await showCardDetails(true);
    await hideCardDetails();
    await setSpriteCards(idCard, computerCardId);

    let duelResults = await checkDuelResults(idCard, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function showCardDetails(value){
    if(value == true){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }else{
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
    
}

async function hideCardDetails(){
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function setSpriteCards(idCard, computerCardId){
    state.fieldCards.player.src = cardData[idCard].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}
async function drawButton(text){
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win ${state.score.playerScore} | Lose ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "draw";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "win";
        state.score.playerScore++;
    }else if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "lose";
        state.score.computerScore++;
    }else{
        duelResults = "draw";
    }

    await playAudio(duelResults);

    return duelResults;
}
async function removeAllCardsImages(){
    let {computerBox, playerBox} = state.playerSides;
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = playerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(idx){
    state.cardSprites.avatar.src = cardData[idx].img;
    state.cardSprites.name.innerText = cardData[idx].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[idx].type;
}

async function drawCards(cardNumbers, fieldSide){
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomIdCard();  
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
        // fieldSide.appendChild(cardImage);
    }
}

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
   
    try {
        audio.play();
    } catch{}
    
}

function init(){
    // drawCards(5, state.fieldCards.player);
    // drawCards(5, state.fieldCards.computer);

    showCardDetails(false);
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    //bgm.play();
}

init();