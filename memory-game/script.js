const ICONS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'];
let cardsArray = [];

const resetToastEl = document.getElementById('reset-toast');
let winModal = null;

const player1Input = document.getElementById("player1-name");
const player2Input = document.getElementById("player2-name");

const btnStartGame = document.getElementById("start-btn");

const setupForm = document.getElementById("setup-form");

const setupScreen = document.getElementById("setup-screen");
const gameScreen = document.getElementById("game-screen");

const gameBoard = document.getElementById("game-board");

const p1NameDisplay = document.getElementById("p1-name-display");
const p2NameDisplay = document.getElementById("p2-name-display");

const btnNewGame = document.getElementById("new-game-btn");
const btnResetGame = document.getElementById("reset-btn");

const timerDisplay = document.getElementById("timer-display");
let timerInterval = null;
let totalSeconds = 0;

const p1Attempts = document.getElementById("p1-attempts");
const p1Pairs = document.getElementById("p1-pairs");
const p1Wins = document.getElementById("p1-wins");

const p2Attempts = document.getElementById("p2-attempts");
const p2Pairs = document.getElementById("p2-pairs");
const p2Wins = document.getElementById("p2-wins");


const turnInicator = document.getElementById("turn-indicator");
const p1Card = document.getElementById("player1-card");
const p2Card = document.getElementById("player2-card");

const modalIcon = document.getElementById("winner-icon");
const modalTitle = document.getElementById("winner-title");
const modalMessage = document.getElementById("winner-message");
const modalWinTracker = document.getElementById("win-tracker-summary");

const btnRematch = document.getElementById("rematch-btn");
const btnNewGameModal = document.getElementById("new-game-modal-btn");

let gameState = {};

let firstCard = null;      
let secondCard = null;     
let lockBoard = false;  

// ---- Function ----

function checkInputs() {
    if (player1Input.value.trim() !== "" && player2Input.value.trim() !== "") {
        btnStartGame.disabled = false;
    } else {
        btnStartGame.disabled = true;
    }
};


function handleSetupSubmit(e) {
    e.preventDefault(); 
    
    const selectedDifficulty = e.target.elements.difficulty.value;
    
    gameState = {
        player1: player1Input.value.trim(),
        player2: player2Input.value.trim(),
        difficulty: Number(selectedDifficulty), 
        currentTurn: 1,
        p1Attempts: 0, 
        p2Attempts: 0, 
        p1Score: 0,
        p2Score: 0,
        p1Wins: 0,
        p2Wins: 0, 
        totalPairs: Number(selectedDifficulty) / 2, 
        matchedPairs: 0     
    };
    setupScreen.classList.toggle("d-none");
    gameScreen.classList.toggle("d-none");

    p1NameDisplay.innerText = gameState.player1;
    p2NameDisplay.innerText = gameState.player2;

    turnInicator.innerText = `תור: ${gameState.player1}`

    createBoard();
    renderBoard();
    startTimer();    
};

function handleNewGame() {
    const toast = bootstrap.Toast.getInstance(resetToastEl);
    if (toast) {
        toast.hide();
    }
    player1Input.value = "";
    player2Input.value = "";
    btnStartGame.disabled = true;

    setupScreen.classList.toggle("d-none");
    gameScreen.classList.toggle("d-none");

    handleReset();
}

function createBoard() {
    let pairsCount = gameState.totalPairs;     
    let sliceIcons = ICONS.slice(0,pairsCount);
    let tempCardsArray = [...sliceIcons, ...sliceIcons];
    
    cardsArray = tempCardsArray.sort(() => Math.random() - 0.5);     
}

function renderBoard() {
    gameBoard.innerHTML = "";
 
    const isHard = cardsArray.length === 24;
    const colClass = isHard ? "col-auto" : "col-3 col-md-2";
    const colStyle = isHard ? 'style="width: 12.5%;"' : '';

    const boardHtml = cardsArray.map((card, index) => `
        <div class="${colClass} d-flex justify-content-center" ${colStyle}>
            <div class="card card-item game-card closed w-100 ratio ratio-1x1 shadow-sm text-center" data-index="${index}">
                <div class="card-content d-flex align-items-center justify-content-center h-100">
                    <span class="card-icon display-4 user-select-none mb-0">${card}</span>
                </div>
            </div>
        </div>
    `).join('');

    gameBoard.innerHTML = boardHtml;
}

function handleReset(e) {
    p1Attempts.innerText = 0;
    p1Pairs.innerText = 0;
    p2Attempts.innerText = 0;
    p2Pairs.innerText = 0;  
    gameState.currentTurn = 1; 
    gameState.p1Attempts = 0; 
    gameState.p2Attempts = 0; 
    gameState.p1Score = 0; 
    gameState.p2Score = 0; 
    gameState.matchedPairs = 0; 

    if (e && e.target && e.target.closest('#reset-btn')) {
        p1Wins.innerText = 0;
        p2Wins.innerText = 0; 
        gameState.p1Wins = 0; 
        gameState.p2Wins = 0; 
        const toast = new bootstrap.Toast(resetToastEl);
        toast.show();
    }
    createBoard();
    renderBoard(); 
    startTimer();
    resetTurn();  
}


// Timer functions

function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');   
    
    timerDisplay.innerText = `${minutes}:${seconds}`;
}

function startTimer() {    
    stopTimer();
    
    totalSeconds = 0;
    updateTimerDisplay(); 
    
    timerInterval = setInterval(() => {
        totalSeconds++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}


// Cards Click functions

function handleCardClick(e) {
    const clickedCard = e.target.closest('.game-card');
    
    if (lockBoard || !clickedCard || clickedCard.classList.contains('flipped') || clickedCard === firstCard) {
        return;
    }

    clickedCard.classList.remove('closed');
    clickedCard.classList.add('flipped');

    if (!firstCard) {
        firstCard = clickedCard; 
    } else {
        secondCard = clickedCard;
        lockBoard = true;
        checkCardsMatch();
    }
};

function checkCardsMatch() {
    const firstIndex = Number(firstCard.dataset.index);
    const secondIndex = Number(secondCard.dataset.index);

    if (gameState.currentTurn ===1) {
        gameState.p1Attempts ++;
        p1Attempts.innerText = gameState.p1Attempts;
        
    } else {
        gameState.p2Attempts ++;
        p2Attempts.innerText = gameState.p2Attempts;

    }

    if (cardsArray[firstIndex] === cardsArray[secondIndex]) {
        disableCards();
    } else {
       unflipCards();
    }   
}


function disableCards() {
    const matchClass = gameState.currentTurn === 1 ? 'matched-p1' : 'matched-p2';
    firstCard.classList.add(matchClass);
    secondCard.classList.add(matchClass);

    if (gameState.currentTurn ===1) {
        gameState.p1Score ++;
        p1Pairs.innerText = gameState.p1Score;
    } else {
        gameState.p2Score ++;
        p2Pairs.innerText = gameState.p2Score;
    }

    gameState.matchedPairs ++;
    resetTurn();

    if (gameState.matchedPairs === gameState.totalPairs) {
        stopTimer();
        showWinModal()
    }
}

function unflipCards() {

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        firstCard.classList.add('closed');
        secondCard.classList.remove('flipped');
        secondCard.classList.add('closed');

        gameState.currentTurn = gameState.currentTurn === 1 ? 2 : 1;
        if (gameState.currentTurn === 1) {
            turnInicator.classList.remove(`bg-success`);
            turnInicator.classList.add(`bg-primary`);

            p2Card.classList.remove(`border-success`, `border-4`);
            p2Card.classList.add(`border-2`);

            p1Card.classList.add(`border-primary`, `border-4`);            
            p1Card.classList.remove(`border-2`); 

            turnInicator.innerText = `תור: ${gameState.player1}`
        } else {
            turnInicator.classList.remove(`bg-primary`);
            turnInicator.classList.add(`bg-success`);

            p1Card.classList.remove(`border-primary`, `border-4`);
            p1Card.classList.add(`border-2`);

            p2Card.classList.add(`border-success`, `border-4`); 
            p2Card.classList.remove(`border-2`); 

            turnInicator.innerText = `תור: ${gameState.player2}`
        }
        resetTurn();
    }, 1200);  
      
}

function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function showWinModal() {
    if (!winModal) {
        winModal = new bootstrap.Modal(document.getElementById('winModal'));
    }
    winModal.show();
    const player1Score = gameState.p1Score;
    const player2Score = gameState.p2Score;


    if (player1Score > player2Score) {        
        gameState.p1Wins++;
        p1Wins.innerText = gameState.p1Wins;
        modalIcon.innerText = "🎉";
        modalTitle.innerText = `כל הכבוד ${gameState.player1} !`;
        modalMessage.innerText = `ניצחת עם ${gameState.p1Score} זוגות מתוך ${gameState.totalPairs} 
        לעומת ${gameState.p2Score} זוגות של ${gameState.player2}`
    } else if (player1Score < player2Score) {        
        gameState.p2Wins++;
        p2Wins.innerText = gameState.p2Wins;
        modalIcon.innerText = "🎉";
        modalTitle.innerText = `כל הכבוד ${gameState.player2} !`;
        modalMessage.innerText = `ניצחת עם ${gameState.p2Score} זוגות מתוך ${gameState.totalPairs} 
        לעומת ${gameState.p1Score} זוגות של ${gameState.player1}`
    } else {
        modalIcon.innerText = "🤝";
        modalTitle.innerText = `תיקו מותח!`;
        modalMessage.innerText = `שניכם מצאתם ${gameState.p1Score} זוגות מתוך ${gameState.totalPairs}`            
    }
    modalWinTracker.innerText = `${gameState.player1}: ${gameState.p1Wins} | ${gameState.player2}: ${gameState.p2Wins}`
}

function startRematch() {
    winModal.hide();
    handleReset();
}

function resetToSetup() {
    winModal.hide();
    handleReset();
    handleNewGame();
}


// ---- Event Listeners ----

player1Input.addEventListener("input", checkInputs);
player2Input.addEventListener("input", checkInputs);

setupForm.addEventListener("submit", handleSetupSubmit);

btnNewGame.addEventListener("click", handleNewGame);
btnResetGame.addEventListener("click", handleReset);

gameBoard.addEventListener('click', handleCardClick);

btnRematch.addEventListener('click', startRematch);
btnNewGameModal.addEventListener('click', resetToSetup);
