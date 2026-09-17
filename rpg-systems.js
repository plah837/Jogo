(function () {
  "use strict";

  const STORAGE_KEY = "kingdoms_player_data";

  const raceData = {
    elfo: {
      name: "Elfo",
      starterWeapon: "bow",
      health: 100,
      mana: 60,
      strength: 12,
      defense: 10,
      agility: 16,
      intelligence: 12
    },

    anjo: {
      name: "Anjo",
      starterWeapon: "staff",
      health: 110,
      mana: 70,
      strength: 10,
      defense: 14,
      agility: 11,
      intelligence: 15
    },

    demonio: {
      name: "Demônio",
      starterWeapon: "sword",
      health: 120,
      mana: 50,
      strength: 18,
      defense: 12,
      agility: 12,
      intelligence: 10
    }
  };

  const weapons = {
    bow: {
      id: "bow",
      name: "Arco inicial",
      icon: "🏹",
      type: "Distância",
      damage: 18,
      requiredLevel: 1,
      description: "Arma inicial dos elfos."
    },

    sword: {
      id: "sword",
      name: "Espada de ferro",
      icon: "⚔️",
      type: "Corpo a corpo",
      damage: 22,
      requiredLevel: 1,
      description: "Uma espada equilibrada."
    },

    axe: {
      id: "axe",
      name: "Machado de batalha",
      icon: "🪓",
      type: "Corpo a corpo",
      damage: 30,
      requiredLevel: 10,
      description: "Causa muito dano, mas é mais lento."
    },

    staff: {
      id: "staff",
      name: "Cajado sagrado",
      icon: "🔱",
      type: "Mágica",
      damage: 20,
      requiredLevel: 1,
      description: "Canaliza energia espiritual."
    }
  };

  const defaultPlayer = {
    name: "Aventureiro",
    raceId: "elfo",
    level: 1,
    experience: 0,
    availablePoints: 0,
    stats: {
      health: 100,
      mana: 60,
      strength: 12,
      defense: 10,
      agility: 16,
      intelligence: 12
    },
    inventory: ["bow", "sword"],
    equippedWeapon: "bow",
    skinColor: "#f1d1b5",
    hairColor: "#5b3a2a",
    clothColor: "#2d8cff",
    weapon: "bow"
  };

  let player = loadPlayer();

  function loadPlayer() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return structuredClone(defaultPlayer);

      const parsed = JSON.parse(saved);
      return {
        ...structuredClone(defaultPlayer),
        ...parsed,
        stats: {
          ...defaultPlayer.stats,
          ...(parsed.stats || {})
        },
        inventory: Array.isArray(parsed.inventory)
          ? parsed.inventory
          : [...defaultPlayer.inventory]
      };
    } catch (error) {
      console.warn("Não foi possível carregar o jogador.", error);
      return structuredClone(defaultPlayer);
    }
  }

  function savePlayer() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  }

  function getCurrentRace() {
    return raceData[player.raceId] || raceData.elfo;
  }

  function getCurrentWeapon() {
    return weapons[player.equippedWeapon] || weapons.bow;
  }

  function updateText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function updatePlayerInterface() {
    const race = getCurrentRace();
    const weapon = getCurrentWeapon();

    updateText("display-player-name", player.name);
    updateText("display-player-race", race.name);
    updateText("display-level", player.level);

    updateText("stat-health", player.stats.health);
    updateText("stat-mana", player.stats.mana);
    updateText("stat-strength", player.stats.strength);
    updateText("stat-defense", player.stats.defense);
    updateText("stat-agility", player.stats.agility);
    updateText("stat-intelligence", player.stats.intelligence);
    updateText("stat-points", player.availablePoints);

    const healthBar = document.getElementById("health-progress");
    const manaBar = document.getElementById("mana-progress");
    const experienceBar = document.getElementById("experience-progress");

    if (healthBar) healthBar.style.width = "100%";
    if (manaBar) manaBar.style.width = `${Math.min(100, player.stats.mana)}%`;
    if (experienceBar) {
      const requiredExperience = player.level * 100;
      const percent = Math.min(100, (player.experience / requiredExperience) * 100);
      experienceBar.style.width = `${percent}%`;
    }

    if (weapon) {
      updateText("equipped-weapon-name", weapon.name);
      updateText("equipped-weapon-damage", weapon.damage);
    }

    savePlayer();
  }

  function applyRace(raceId) {
    if (!raceData[raceId]) raceId = "elfo";
    const race = raceData[raceId];

    player.raceId = raceId;
    player.stats = {
      health: race.health,
      mana: race.mana,
      strength: race.strength,
      defense: race.defense,
      agility: race.agility,
      intelligence: race.intelligence
    };

    if (!player.inventory.includes(race.starterWeapon)) {
      player.inventory.push(race.starterWeapon);
    }

    player.equippedWeapon = race.starterWeapon;
    player.weapon = race.starterWeapon;
    player.skinColor = player.skinColor || "#f1d1b5";
    player.hairColor = player.hairColor || "#5b3a2a";
    player.clothColor = player.clothColor || "#2d8cff";

    updatePlayerInterface();
    renderInventory();
    if (window.applyCharacterAppearance) {
      window.applyCharacterAppearance({
        name: player.name,
        race: player.raceId,
        skinColor: player.skinColor,
        hairColor: player.hairColor,
        clothColor: player.clothColor,
        weapon: player.weapon
      });
    }
  }

  function resetStats() {
    const race = getCurrentRace();
    player.stats = {
      health: race.health,
      mana: race.mana,
      strength: race.strength,
      defense: race.defense,
      agility: race.agility,
      intelligence: race.intelligence
    };
    player.availablePoints = 0;
    updatePlayerInterface();
    alert("Estatísticas resetadas gratuitamente!");
  }

  function equipWeapon(weaponId) {
    const weapon = weapons[weaponId];
    if (!weapon) return;
    if (!player.inventory.includes(weaponId)) {
      alert("Essa arma não está no seu inventário.");
      return;
    }
    if (player.level < weapon.requiredLevel) {
      alert(`Você precisa do nível ${weapon.requiredLevel} para usar esta arma.`);
      return;
    }

    player.equippedWeapon = weaponId;
    player.weapon = weaponId;
    savePlayer();
    updatePlayerInterface();
    renderInventory();
    if (window.applyCharacterAppearance) {
      window.applyCharacterAppearance({
        name: player.name,
        race: player.raceId,
        skinColor: player.skinColor,
        hairColor: player.hairColor,
        clothColor: player.clothColor,
        weapon: player.weapon
      });
    }
  }

  function updateAppearanceFromInputs() {
    const skin = document.getElementById("skin-color");
    const hair = document.getElementById("hair-color");
    const cloth = document.getElementById("cloth-color");
    const weapon = document.getElementById("weapon-select");

    if (skin) player.skinColor = skin.value;
    if (hair) player.hairColor = hair.value;
    if (cloth) player.clothColor = cloth.value;
    if (weapon) player.weapon = weapon.value;

    if (window.applyCharacterAppearance) {
      window.applyCharacterAppearance({
        name: player.name,
        race: player.raceId,
        skinColor: player.skinColor,
        hairColor: player.hairColor,
        clothColor: player.clothColor,
        weapon: player.weapon
      });
    }
  }

  function renderInventory() {
    const modalContent = document.querySelector("#inventory-modal .modal-content");
    if (!modalContent) return;

    const equipped = getCurrentWeapon();
    modalContent.innerHTML = `
      <button class="close-button" data-close="inventory-modal">×</button>
      <h2>Inventário</h2>
      <div class="equipped-weapon">
        <span class="big-item-icon">${equipped.icon}</span>
        <div>
          <strong>${equipped.name}</strong>
          <p>Dano: ${equipped.damage}</p>
          <p>Tipo: ${equipped.type}</p>
        </div>
      </div>
      <div class="real-inventory-grid">
        ${player.inventory.map((weaponId) => {
          const weaponItem = weapons[weaponId];
          if (!weaponItem) return "";
          const isEquipped = player.equippedWeapon === weaponId;
          return `
            <div class="real-item ${isEquipped ? "is-equipped" : ""}">
              <span class="big-item-icon">${weaponItem.icon}</span>
              <strong>${weaponItem.name}</strong>
              <small>${weaponItem.type}</small>
              <small>Dano: ${weaponItem.damage}</small>
              <button class="equip-button" data-weapon="${weaponItem.id}" ${isEquipped ? "disabled" : ""}>
                ${isEquipped ? "Equipado" : "Equipar"}
              </button>
            </div>
          `;
        }).join("")}
      </div>
    `;

    modalContent.querySelectorAll(".equip-button").forEach((button) => {
      button.addEventListener("click", () => equipWeapon(button.dataset.weapon));
    });

    modalContent.querySelector(".close-button")?.addEventListener("click", () => {
      document.getElementById("inventory-modal").classList.add("hidden");
    });
  }

  function renderDungeonSystem() {
    const modalContent = document.querySelector("#dungeon-modal .modal-content");
    if (!modalContent) return;

    const dungeons = [
      { name: "Caverna dos Goblins", level: 20, monsters: "Goblins", reward: "Espada rara" },
      { name: "Ruínas Celestiais", level: 500, monsters: "Gárgulas", reward: "Armadura sagrada" },
      { name: "Dungeon do Lord Demon", level: 1200, monsters: "Lord Demon", reward: "Arma lendária" }
    ];

    modalContent.innerHTML = `
      <button class="close-button" data-close="dungeon-modal">×</button>
      <h2>Dungeons</h2>
      ${dungeons.map((dungeon) => {
        const locked = player.level < dungeon.level;
        return `
          <div class="real-dungeon-card ${locked ? "locked" : ""}">
            <h3>${dungeon.name}</h3>
            <p>Nível recomendado: ${dungeon.level}</p>
            <p>Monstros: ${dungeon.monsters}</p>
            <p>Recompensa: ${dungeon.reward}</p>
            <button class="enter-dungeon-button" ${locked ? "disabled" : ""}>
              ${locked ? "Nível insuficiente" : "Entrar na dungeon"}
            </button>
          </div>
        `;
      }).join("")}
    `;

    modalContent.querySelector(".close-button")?.addEventListener("click", () => {
      document.getElementById("dungeon-modal").classList.add("hidden");
    });
  }

  function connectCharacterCreation() {
    const createButton = document.getElementById("create-character-button");
    if (!createButton) return;

    createButton.addEventListener("click", () => {
      const nameInput = document.getElementById("player-name");
      const selectedCard = document.querySelector(".race-card.selected");
      const selectedRace = selectedCard?.dataset.race || "elfo";

      player.name = nameInput?.value.trim() || "Aventureiro";
      player.raceId = selectedRace;
      player.skinColor = document.getElementById("skin-color")?.value || player.skinColor;
      player.hairColor = document.getElementById("hair-color")?.value || player.hairColor;
      player.clothColor = document.getElementById("cloth-color")?.value || player.clothColor;
      player.weapon = document.getElementById("weapon-select")?.value || player.weapon;

      applyRace(selectedRace);
      updateAppearanceFromInputs();
      renderInventory();
      renderDungeonSystem();
      savePlayer();
    });
  }

  function connectButtons() {
    document.getElementById("reset-stats-button")?.addEventListener("click", resetStats);
    document.getElementById("stats-button")?.addEventListener("click", () => {
      document.querySelector("#stats-modal .modal-content")?.classList.remove("hidden");
    });
  }

  function prepareDefaultAppearance() {
    const skin = document.getElementById("skin-color");
    const hair = document.getElementById("hair-color");
    const cloth = document.getElementById("cloth-color");
    const weapon = document.getElementById("weapon-select");

    if (skin) skin.value = player.skinColor || "#f1d1b5";
    if (hair) hair.value = player.hairColor || "#5b3a2a";
    if (cloth) cloth.value = player.clothColor || "#2d8cff";
    if (weapon) weapon.value = player.weapon || "bow";
  }

  window.addEventListener("load", () => {
    prepareDefaultAppearance();
    connectCharacterCreation();
    connectButtons();
    renderInventory();
    renderDungeonSystem();
    updatePlayerInterface();
    savePlayer();
  });

  window.gamePlayer = {
    getData: () => player,
    addExperience(amount) {
      player.experience += amount;
      const requiredExperience = player.level * 100;
      while (player.experience >= requiredExperience) {
        player.experience -= requiredExperience;
        player.level += 1;
        player.availablePoints += 5;
      }
      savePlayer();
      updatePlayerInterface();
    },
    addWeapon(weaponId) {
      if (!weapons[weaponId]) return false;
      if (!player.inventory.includes(weaponId)) {
        player.inventory.push(weaponId);
        savePlayer();
        renderInventory();
      }
      return true;
    }
  };
})();
