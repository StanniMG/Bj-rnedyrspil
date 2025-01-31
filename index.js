// Labels
const talLabel = document.getElementById("talLabel");
const bonusLabel = document.getElementById("bonusLabel"); // Ny label til bonus
const increasePerSecLabel = document.getElementById("increasePerSecLabel");
const countdownLabel = document.getElementById("countdownLabel");
const gameOverLabel = document.getElementById("gameOverLabel");
const katastrofeLabel = document.getElementById("katastrofeLabel");
const fotosynteseCountdownLabel = document.getElementById("fotosynteseCountdownLabel");
const levelLabel = document.getElementById("levelLabel");
const katastrofeTypeLabel = document.getElementById("katastrofeTypeLabel");
const warLossPreviewLabel = document.getElementById("warLossPreviewLabel");


// Buttons
const klikBtn = document.getElementById("klikBtn");
const fotosyntese = document.getElementById("fotosynteseUp");
const skjoldUp = document.getElementById("skjoldUp");
const katastrofeUp = document.getElementById("katastrofeUp");
const increaseBtn = document.getElementById("increase1Btn");
const secIncrease1Btn = document.getElementById("secIncrease1Btn");

// Variables
let count = 200;
let increase = 1;
let increaseCost = 50;
let plusIncrease = 1;
let increasePerSec = 2;
let increasePerSecCost = 75;
let plusIncreasePerSec = 1;

let countdown = 30; // Tid i sekunder
let gameOver = false;
let fotosynteseCountdown = 10; // Tid til fotosyntese-bonus
let level = 0; // Start-level
let baseWarLoss = 100;
let nextCatastrophe = "Krig"; // Starter med krig
// Upgrades
const tooltip = document.getElementById("tooltip");
let fotosynteseActive = false;
let fotosynteseCost = 100;
let skjoldActive = false;
let skjoldCost = 100;
let katastrofeCost = 200; // Pris for opgraderingen
let katastrofeDelay = 0; // Forsinkelse af katastrofer
let katastrofeUpActive = false; // Status for opgraderingen



// Helper function to format numbers with a dot every three zeros
function formatNumber(number) {
    return number.toLocaleString('da-DK');
}

function updateUI() {
    talLabel.textContent = `${formatNumber(count)}`;
    increasePerSecLabel.textContent = `${formatNumber(increasePerSec)} per sekund`;
    levelLabel.textContent = `Level: ${level}`;
    fotosyntese.textContent = `Fotosyntese (${formatNumber(fotosynteseCost)})`;
    skjoldUp.textContent = `Skjold (${formatNumber(skjoldCost)})`;
    katastrofeUp.textContent = `Forsinkelse (${formatNumber(katastrofeCost)})`;
    warLossPreviewLabel.textContent = `Tab ved næste krig: ${formatNumber(baseWarLoss)}`;
    let adjustedWarLoss = baseWarLoss; // Brug kun baseWarLoss
    if (skjoldActive) {
        adjustedWarLoss *= 0.5; // Reducer tabene, hvis skjold er aktivt
    }
    warLossPreviewLabel.textContent = `Tab ved næste krig: ${formatNumber(adjustedWarLoss)}`;


    // Fotosyntese-status
    if (fotosynteseActive) {
        fotosyntese.classList.remove("can-buy");
        fotosyntese.classList.add("purchased");
        fotosynteseCountdownLabel.textContent = `Tid til fotosyntese bonus: ${fotosynteseCountdown} sekunder`;
    } else if (count >= fotosynteseCost) {
        fotosyntese.classList.add("can-buy");
        fotosyntese.classList.remove("purchased");
    } else {
        fotosyntese.classList.remove("can-buy", "purchased");
        fotosynteseCountdownLabel.display = "block";
    }

    // Skjold-status
    if (skjoldActive) {
        skjoldUp.classList.remove("can-buy");
        skjoldUp.classList.add("purchased");
    } else if (count >= skjoldCost) {
        skjoldUp.classList.add("can-buy");
        skjoldUp.classList.remove("purchased");
    } else {
        skjoldUp.classList.remove("can-buy", "purchased");
    }
        // Katastrofe Forsinkelse-status
    if (katastrofeUpActive) {
        katastrofeUp.classList.remove("can-buy");
        katastrofeUp.classList.add("purchased");
    } else if (count >= katastrofeCost) {
        katastrofeUp.classList.add("can-buy");
        katastrofeUp.classList.remove("purchased");
    } else {
        katastrofeUp.classList.remove("can-buy", "purchased");
    }

}
// Initial UI setup
updateUI();

// Fotosyntese-knap
fotosyntese.onclick = function () {
    if (count >= fotosynteseCost && !fotosynteseActive) {
        fotosynteseActive = true;
        count -= fotosynteseCost;
        updateUI();

        setInterval(() => {
            if (fotosynteseActive && !gameOver) {
                if (fotosynteseCountdown > 1) {
                    fotosynteseCountdown--;
                } else {
                    const bonus = Math.floor(count * 0.1); // 10% af bjørnedyr
                    count += bonus;

                    bonusLabel.textContent = `+${formatNumber(bonus)}`;
                    bonusLabel.style.opacity = 1;

                    setTimeout(() => {
                        bonusLabel.style.opacity = 0;
                    }, 1000);

                    fotosynteseCountdown = 10;
                }
                updateUI();
            }
        }, 1000);
    }
};

// Skjold-knap
skjoldUp.onclick = function () {
    if (count >= skjoldCost && !skjoldActive) {
        skjoldActive = true;
        count -= skjoldCost;
        updateUI();
    }
};

// Opgraderingsknap til katastrofe-forsinkelse
katastrofeUp.onclick = function () {
    if (count >= katastrofeCost && !katastrofeUpActive) {
        count -= katastrofeCost;
        katastrofeUpActive = true;
        katastrofeDelay = 10; // Forsink katastrofer med 10 sekunder
        updateUI();
    }
};

// Tooltip-håndtering
[fotosyntese, skjoldUp, katastrofeUp].forEach(button => {
    button.addEventListener("mouseover", (event) => {
        tooltip.style.display = "block";
        tooltip.style.left = `${event.target.getBoundingClientRect().left}px`;
        tooltip.style.top = `${event.target.getBoundingClientRect().top - tooltip.offsetHeight - 10}px`;

        if (event.target === fotosyntese) {
            tooltip.textContent = "Fotosyntese: Giver 10% af dine bjørnedyr hvert 10. sekund. Koster 100 point.";
        } else if (event.target === skjoldUp) {
            tooltip.textContent = "Skjold: Reducerer krigstab til 50%. Koster 100 bjørnedyr.";
        } else if (event.target === katastrofeUp) {
            tooltip.textContent = "Forsinkelse: Forsink katastrofer med 10 sekunder, begynder efter næste katastrofe. Koster 200 bjørnedyr";
        }
    });

    button.addEventListener("mouseout", () => {
        tooltip.style.display = "none";
    });
});


// Buy more points per second
secIncrease1Btn.onclick = function () {
    if (count >= increasePerSecCost) {
        count -= increasePerSecCost;
        increasePerSec += plusIncreasePerSec;
        updateUI();
    }
};

// Auto-increment points per second
setInterval(function () {
    if (!gameOver) {
        count += increasePerSec;
        updateUI();
    }
}, 1000);

function handlePointLoss() {
    if (gameOver) return;

    if (nextCatastrophe === "Krig") {
        let warLoss = baseWarLoss; // Brug den aktuelle baseWarLoss
        if (skjoldActive) {
            warLoss *= 0.5; // Reducer tabene, hvis skjold er aktivt
        }
        count -= warLoss;
        katastrofeLabel.textContent = `Krig: Du har mistet ${formatNumber(warLoss)} bjørnedyr.`;

        baseWarLoss *= 2; // Fordobl kun efter en krig
    } else if (nextCatastrophe === "Sygdom") {
        count = Math.floor(count * 0.5); // Sygdom: Tab 30 %
        katastrofeLabel.textContent = "Sygdom: Du har mistet 50% af dine bjørnedyr.";
    }

    level++; // Øg level efter hver katastrofe
    updateUI();

    katastrofeLabel.style.display = "block";
    setTimeout(() => {
        katastrofeLabel.style.display = "none";
    }, 10000);
    nextCatastrophe = nextCatastrophe === "Krig" ? "Sygdom" : "Krig";
    checkGameOver();
    countdown = 30 + katastrofeDelay; // Tilføj forsinkelse
}


// Check if the game is over
function checkGameOver() {
    if (count < 0) {
        gameOver = true;
        gameOverLabel.textContent = "Du har tabt spillet!";
        gameOverLabel.style.display = "block";
        clearInterval(gameTimer);
    }
}

// Katastrofe-nedtælling med forsinkelse
const gameTimer = setInterval(function () {
    if (gameOver) return;

    if (countdown > 1) {
        countdown--;
        countdownLabel.textContent = `Tid til ${nextCatastrophe}: ${countdown} sekunder`;
    } else {
        handlePointLoss();
    }
}, 1000);
updateUI();
