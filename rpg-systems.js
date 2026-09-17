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
    equippedWeapon: "bow"
  };

  let player = loadPlayer();

  function loadPlayer() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return structuredClone(defaultPlayer);
      }

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

    if (element) {
      element.textContent = value;
    }
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

    if (healthBar) {
      healthBar.style.width = "100%";
    }

    if (manaBar) {
      const manaPercent = Math.min(100, player.stats.mana);
      manaBar.style.width = `${manaPercent}%`;
    }

    if (experienceBar) {
      const experienceRequired = player.level * 100;
      const experiencePercent =
        (player.experience / experienceRequired) * 100;

      experienceBar.style.width =
        `${Math.min(100, experiencePercent)}%`;
    }

    updateText("equipped-weapon-name", weapon.name);
    updateText("equipped-weapon-damage", weapon.damage);

    savePlayer();
  }

  function applyRace(raceId) {
    if (!raceData[raceId]) {
      raceId = "elfo";
    }

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

    updatePlayerInterface();
    renderInventory();
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

    savePlayer();
    updatePlayerInterface();

    alert("Estatísticas resetadas gratuitamente!");
  }

  function addStat(statName) {
    if (player.availablePoints <= 0) {
      alert("Você não possui pontos disponíveis.");
      return;
    }

    if (!Object.prototype.hasOwnProperty.call(player.stats, statName)) {
      return;
    }

    player.stats[statName] += 1;
    player.availablePoints -= 1;

    savePlayer();
    updatePlayerInterface();
    renderStats();
  }

  function renderStats() {
    const modalContent = document.querySelector("#stats-modal .modal-content");

    if (!modalContent) {
      return;
    }

    let statControls = document.getElementById("stat-controls");

    if (!statControls) {
      statControls = document.createElement("div");
      statControls.id = "stat-controls";
      statControls.className = "stat-list";
      modalContent.appendChild(statControls);
    }

    const stats = [
      ["health", "Vida"],
      ["mana", "Mana"],
      ["strength", "Força"],
      ["defense", "Defesa"],
      ["agility", "Agilidade"],
      ["intelligence", "Inteligência"]
    ];

    statControls.innerHTML = stats
      .map(([id, name]) => {
        return `
          <div class="stat-control-row">
            <span>${name}</span>
            <strong>${player.stats[id]}</strong>
            <button class="add-stat-button" data-stat="${id}">
              +
            </button>
          </div>
        `;
      })
      .join("");

    statControls
      .querySelectorAll(".add-stat-button")
      .forEach(button => {
        button.addEventListener("click", () => {
          addStat(button.dataset.stat);
        });
      });
  }

  function equipWeapon(weaponId) {
    const weapon = weapons[weaponId];

    if (!weapon) {
      return;
    }

    if (!player.inventory.includes(weaponId)) {
      alert("Essa arma não está no seu inventário.");
      return;
    }

    if (player.level < weapon.requiredLevel) {
      alert(`Você precisa do nível ${weapon.requiredLevel} para usar esta arma.`);
      return;
    }

    player.equippedWeapon = weaponId;

    savePlayer();
    updatePlayerInterface();
    renderInventory();
  }

  function renderInventory() {
    const modalContent = document.querySelector(
      "#inventory-modal .modal-content"
    );

    if (!modalContent) {
      return;
    }

    let inventoryContainer = document.getElementById("real-inventory");

    if (!inventoryContainer) {
      inventoryContainer = document.createElement("div");
      inventoryContainer.id = "real-inventory";
      modalContent.appendChild(inventoryContainer);
    }

    const equipped = getCurrentWeapon();

    inventoryContainer.innerHTML = `
      <h3>Arma equipada</h3>

      <div class="equipped-weapon">
        <span class="big-item-icon">${equipped.icon}</span>
        <div>
          <strong>${equipped.name}</strong>
          <p>Dano: ${equipped.damage}</p>
          <p>Tipo: ${equipped.type}</p>
        </div>
      </div>

      <h3>Suas armas</h3>

      <div class="real-inventory-grid">
        ${player.inventory
          .map(weaponId => {
            const weapon = weapons[weaponId];

            if (!weapon) {
              return "";
            }

            const isEquipped = player.equippedWeapon === weapon.id;

            return `
              <div class="real-item ${isEquipped ? "is-equipped" : ""}">
                <span class="big-item-icon">${weapon.icon}</span>
                <strong>${weapon.name}</strong>
                <small>${weapon.type}</small>
                <small>Dano: ${weapon.damage}</small>

                <button
                  class="equip-button"
                  data-weapon="${weapon.id}"
                  ${isEquipped ? "disabled" : ""}
                >
                  ${isEquipped ? "Equipado" : "Equipar"}
                </button>
              </div>
            `;
          })
          .join("")}
      </div>
    `;

    inventoryContainer
      .querySelectorAll(".equip-button")
      .forEach(button => {
        button.addEventListener("click", () => {
          equipWeapon(button.dataset.weapon);
        });
      });
  }

  function createDungeonSystem() {
    const modalContent = document.querySelector(
      "#dungeon-modal .modal-content"
    );

    if (!modalContent) {
      return;
    }

    let dungeonContainer = document.getElementById("real-dungeons");

    if (!dungeonContainer) {
      dungeonContainer = document.createElement("div");
      dungeonContainer.id = "real-dungeons";
      modalContent.appendChild(dungeonContainer);
    }

    const dungeons = [
      {
        id: "goblins",
        name: "Caverna dos Goblins",
        level: 20,
        monsters: "Goblins, arqueiros e Rei Goblin",
        reward: "Espada rara"
      },
      {
        id: "angel-ruins",
        name: "Ruínas Celestiais",
        level: 500,
        monsters: "Gárgulas e espíritos",
        reward: "Armadura sagrada"
      },
      {
        id: "lord-demon",
        name: "Dungeon do Lord Demon",
        level: 1200,
        monsters: "Demônios, generais e Lord Demon",
        reward: "Arma lendária"
      }
    ];

    dungeonContainer.innerHTML = dungeons
      .map(dungeon => {
        const locked = player.level < dungeon.level;

        return `
          <div class="real-dungeon-card ${locked ? "locked" : ""}">
            <h3>${dungeon.name}</h3>
            <p>Nível recomendado: ${dungeon.level}</p>
            <p>Monstros: ${dungeon.monsters}</p>
            <p>Recompensa: ${dungeon.reward}</p>

            <button
              class="enter-dungeon-button"
              data-dungeon="${dungeon.id}"
              ${locked ? "disabled" : ""}
            >
              ${locked ? "Nível insuficiente" : "Entrar na dungeon"}
            </button>
          </div>
        `;
      })
      .join("");

    dungeonContainer
      .querySelectorAll(".enter-dungeon-button")
      .forEach(button => {
        button.addEventListener("click", () => {
          alert(
            "Dungeon preparada! O combate será adicionado na próxima etapa."
          );
        });
      });
  }

  function connectCharacterCreation() {
    const createButton = document.getElementById(
      "create-character-button"
    );

    if (!createButton) {
      return;
    }

    createButton.addEventListener("click", () => {
      const nameInput = document.getElementById("player-name");
      const selectedCard = document.querySelector(".race-card.selected");

      const selectedRace =
        selectedCard?.dataset.race || "elfo";

      player.name =
        nameInput?.value.trim() || "Aventureiro";

      applyRace(selectedRace);
      renderStats();
      renderInventory();
      createDungeonSystem();
    });
  }

  function connectButtons() {
    const resetButton = document.getElementById("reset-stats-button");

    if (resetButton) {
      resetButton.addEventListener("click", resetStats);
    }

    const statsButton = document.getElementById("stats-button");

    if (statsButton) {
      statsButton.addEventListener("click", () => {
        renderStats();
      });
    }

    const inventoryButton = document.getElementById("inventory-button");

    if (inventoryButton) {
      inventoryButton.addEventListener("click", () => {
        renderInventory();
      });
    }

    const dungeonButton = document.getElementById("dungeon-button");

    if (dungeonButton) {
      dungeonButton.addEventListener("click", () => {
        createDungeonSystem();
      });
    }
  }

  window.addEventListener("load", () => {
    connectCharacterCreation();
    connectButtons();
    renderStats();
    renderInventory();
    createDungeonSystem();
    updatePlayerInterface();
  });

  window.gamePlayer = {
    getData: () => player,
    addExperience(amount) {
      player.experience += amount;

      const requiredExperience = player.level * 100;

      while (player.experience >= requiredExperience) {
        player.experience -= player.level * 100;
        player.level += 1;
        player.availablePoints += 5;
      }

      savePlayer();
      updatePlayerInterface();
      renderStats();
      createDungeonSystem();
    },

    addWeapon(weaponId) {
      if (!weapons[weaponId]) {
        return false;
      }

      if (!player.inventory.includes(weaponId)) {
        player.inventory.push(weaponId);
        savePlayer();
        renderInventory();
      }

      return true;
    },

    resetStats
  };
})();
