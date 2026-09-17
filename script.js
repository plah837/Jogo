const loadingScreen = document.getElementById("loading-screen");
const loadingProgress = document.getElementById("loading-progress");
const mainMenu = document.getElementById("main-menu");
const characterScreen = document.getElementById("character-screen");
const gameScreen = document.getElementById("game-screen");

const startGameButton = document.getElementById("start-game-button");
const continueButton = document.getElementById("continue-button");
const createCharacterButton = document.getElementById("create-character-button");
const backToMenuButton = document.getElementById("back-to-menu-button");

const raceCards = document.querySelectorAll(".race-card");
const playerNameInput = document.getElementById("player-name");
const skinColorInput = document.getElementById("skin-color");
const hairColorInput = document.getElementById("hair-color");
const clothColorInput = document.getElementById("cloth-color");
const weaponSelect = document.getElementById("weapon-select");

const statsButton = document.getElementById("stats-button");
const inventoryButton = document.getElementById("inventory-button");
const dungeonButton = document.getElementById("dungeon-button");

const resetStatsButton = document.getElementById("reset-stats-button");
const statsModal = document.getElementById("stats-modal");
const inventoryModal = document.getElementById("inventory-modal");
const dungeonModal = document.getElementById("dungeon-modal");

const displayPlayerName = document.getElementById("display-player-name");
const displayPlayerRace = document.getElementById("display-player-race");
const displayLevel = document.getElementById("display-level");

const healthProgress = document.getElementById("health-progress");
const manaProgress = document.getElementById("mana-progress");
const experienceProgress = document.getElementById("experience-progress");

const statHealth = document.getElementById("stat-health");
const statMana = document.getElementById("stat-mana");
const statStrength = document.getElementById("stat-strength");
const statDefense = document.getElementById("stat-defense");
const statAgility = document.getElementById("stat-agility");
const statIntelligence = document.getElementById("stat-intelligence");
const statPoints = document.getElementById("stat-points");

let selectedRace = "elfo";
let playerData = {
  name: "Aventureiro",
  race: "Elfo",
  level: 1,
  health: 100,
  mana: 50,
  strength: 10,
  defense: 10,
  agility: 10,
  intelligence: 10,
  points: 0,
  skinColor: "#f1d1b5",
  hairColor: "#5b3a2a",
  clothColor: "#2d8cff",
  weapon: "bow"
};

function setLoading() {
  let progress = 0;

  const interval = setInterval(() => {
    progress += 10;
    loadingProgress.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(interval);

      setTimeout(() => {
        loadingScreen.classList.add("hidden");
        mainMenu.classList.remove("hidden");
      }, 350);
    }
  }, 120);
}

function updateRaceSelection() {
  raceCards.forEach(card => {
    const isSelected = card.dataset.race === selectedRace;
    card.classList.toggle("selected", isSelected);
  });
}

function applyRaceStats() {
  if (selectedRace === "elfo") {
    playerData.health = 100;
    playerData.mana = 60;
    playerData.strength = 12;
    playerData.defense = 10;
    playerData.agility = 16;
    playerData.intelligence = 12;
  } else if (selectedRace === "anjo") {
    playerData.health = 110;
    playerData.mana = 70;
    playerData.strength = 10;
    playerData.defense = 14;
    playerData.agility = 11;
    playerData.intelligence = 15;
  } else if (selectedRace === "demonio") {
    playerData.health = 120;
    playerData.mana = 50;
    playerData.strength = 18;
    playerData.defense = 12;
    playerData.agility = 12;
    playerData.intelligence = 10;
  }
}

function updatePlayerInterface() {
  displayPlayerName.textContent = playerData.name;
  displayPlayerRace.textContent = playerData.race;
  displayLevel.textContent = playerData.level;

  const healthPercent = Math.min(100, (playerData.health / 100) * 100);
  const manaPercent = Math.min(100, (playerData.mana / 100) * 100);

  healthProgress.style.width = healthPercent + "%";
  manaProgress.style.width = manaPercent + "%";
  experienceProgress.style.width = "20%";

  statHealth.textContent = playerData.health;
  statMana.textContent = playerData.mana;
  statStrength.textContent = playerData.strength;
  statDefense.textContent = playerData.defense;
  statAgility.textContent = playerData.agility;
  statIntelligence.textContent = playerData.intelligence;
  statPoints.textContent = playerData.points;
}

function openModal(modal) {
  modal.classList.remove("hidden");
}

function closeModal(modal) {
  modal.classList.add("hidden");
}

function resetStats() {
  const raceName = selectedRace;

  if (raceName === "elfo") {
    playerData.health = 100;
    playerData.mana = 60;
    playerData.strength = 12;
    playerData.defense = 10;
    playerData.agility = 16;
    playerData.intelligence = 12;
  } else if (raceName === "anjo") {
    playerData.health = 110;
    playerData.mana = 70;
    playerData.strength = 10;
    playerData.defense = 14;
    playerData.agility = 11;
    playerData.intelligence = 15;
  } else if (raceName === "demonio") {
    playerData.health = 120;
    playerData.mana = 50;
    playerData.strength = 18;
    playerData.defense = 12;
    playerData.agility = 12;
    playerData.intelligence = 10;
  }

  playerData.points = 0;
  updatePlayerInterface();
}

function syncAppearanceToGame() {
  const appearance = {
    name: playerData.name,
    race: selectedRace,
    skinColor: playerData.skinColor,
    hairColor: playerData.hairColor,
    clothColor: playerData.clothColor,
    weapon: playerData.weapon
  };

  if (window.applyCharacterAppearance) {
    window.applyCharacterAppearance(appearance);
  }
}

startGameButton.addEventListener("click", () => {
  mainMenu.classList.add("hidden");
  characterScreen.classList.remove("hidden");
});

continueButton.addEventListener("click", () => {
  mainMenu.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  updatePlayerInterface();
  syncAppearanceToGame();
});

backToMenuButton.addEventListener("click", () => {
  characterScreen.classList.add("hidden");
  mainMenu.classList.remove("hidden");
});

raceCards.forEach(card => {
  card.addEventListener("click", () => {
    selectedRace = card.dataset.race;
    updateRaceSelection();
  });
});

skinColorInput.addEventListener("input", () => {
  playerData.skinColor = skinColorInput.value;
});

hairColorInput.addEventListener("input", () => {
  playerData.hairColor = hairColorInput.value;
});

clothColorInput.addEventListener("input", () => {
  playerData.clothColor = clothColorInput.value;
});

weaponSelect.addEventListener("change", () => {
  playerData.weapon = weaponSelect.value;
});

createCharacterButton.addEventListener("click", () => {
  const typedName = playerNameInput.value.trim();
  playerData.name = typedName || "Aventureiro";

  if (selectedRace === "elfo") {
    playerData.race = "Elfo";
  } else if (selectedRace === "anjo") {
    playerData.race = "Anjo";
  } else if (selectedRace === "demonio") {
    playerData.race = "Demônio";
  }

  playerData.skinColor = skinColorInput.value;
  playerData.hairColor = hairColorInput.value;
  playerData.clothColor = clothColorInput.value;
  playerData.weapon = weaponSelect.value;

  applyRaceStats();
  characterScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  updatePlayerInterface();
  syncAppearanceToGame();
});

statsButton.addEventListener("click", () => {
  openModal(statsModal);
});

inventoryButton.addEventListener("click", () => {
  openModal(inventoryModal);
});

dungeonButton.addEventListener("click", () => {
  openModal(dungeonModal);
});

resetStatsButton.addEventListener("click", () => {
  resetStats();
});

document.querySelectorAll(".close-button").forEach(button => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.close;
    const targetModal = document.getElementById(targetId);
    if (targetModal) closeModal(targetModal);
  });
});

document.addEventListener("click", event => {
  if (event.target.classList.contains("modal")) {
    closeModal(event.target);
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    statsModal.classList.add("hidden");
    inventoryModal.classList.add("hidden");
    dungeonModal.classList.add("hidden");
  }
});

setLoading();
updateRaceSelection();
updatePlayerInterface();
