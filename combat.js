(function () {
  "use strict";
  const state = { enemy: null, playerHealth: 100, maxHealth: 100, attacking: false };
  const enemies = [
    { name: "Goblin Guardião", maxHealth: 120, health: 120, damage: 6, xp: 35 },
    { name: "Demônio da Floresta", maxHealth: 220, health: 220, damage: 10, xp: 70 },
    { name: "Cavaleiro Infernal", maxHealth: 420, health: 420, damage: 18, xp: 140 }
  ];
  const panel = document.getElementById("combat-panel");
  const attackButton = document.getElementById("attack-button");
  const enemyName = document.getElementById("enemy-name");
  const enemyBar = document.getElementById("enemy-health-progress");
  const enemyText = document.getElementById("enemy-health-text");
  const healthBar = document.getElementById("health-progress");
  const healthText = document.getElementById("combat-health-text");
  const canvas = document.getElementById("game-canvas");

  function player() { return window.gamePlayer?.getData?.() || null; }
  function chooseEnemy() {
    const p = player();
    const level = p?.level || 1;
    state.enemy = level >= 500 ? { ...enemies[2] } : level >= 50 ? { ...enemies[1] } : { ...enemies[0] };
    panel?.classList.remove("hidden");
    updateEnemy();
  }
  function updateEnemy() {
    if (!state.enemy) return;
    enemyName.textContent = state.enemy.name;
    enemyText.textContent = `${Math.max(0, Math.ceil(state.enemy.health))}/${state.enemy.maxHealth}`;
    enemyBar.style.width = `${Math.max(0, state.enemy.health / state.enemy.maxHealth * 100)}%`;
  }
  function updatePlayerHealth() {
    const percent = Math.max(0, state.playerHealth / state.maxHealth * 100);
    healthBar.style.width = `${percent}%`;
    healthText.textContent = `${Math.ceil(state.playerHealth)}/${state.maxHealth}`;
  }
  function floatingDamage(value, color = "#ffd36a") {
    const el = document.createElement("div");
    el.className = "damage-number"; el.textContent = `-${value}`; el.style.color = color;
    el.style.left = `${45 + Math.random() * 10}%`; el.style.top = `${38 + Math.random() * 12}%`;
    document.body.appendChild(el); setTimeout(() => el.remove(), 750);
  }
  function attack() {
    if (state.attacking) return;
    if (!state.enemy || state.enemy.health <= 0) chooseEnemy();
    state.attacking = true;
    const p = player();
    const strength = p?.stats?.strength || 10;
    const weapon = p?.equippedWeapon || "sword";
    const weaponBonus = weapon === "axe" ? 18 : weapon === "bow" ? 12 : weapon === "staff" ? 10 : 15;
    const damage = Math.max(4, strength + weaponBonus + Math.floor(Math.random() * 10));
    state.enemy.health -= damage; floatingDamage(damage);
    canvas?.classList.add("hit-shake"); setTimeout(() => canvas?.classList.remove("hit-shake"), 180);
    updateEnemy();
    if (state.enemy.health <= 0) {
      panel.classList.add("hidden");
      if (window.gamePlayer?.addExperience) window.gamePlayer.addExperience(state.enemy.xp);
      setTimeout(chooseEnemy, 1100);
    } else {
      setTimeout(() => {
        const defense = p?.stats?.defense || 10;
        const received = Math.max(1, state.enemy.damage - Math.floor(defense / 8));
        state.playerHealth = Math.max(0, state.playerHealth - received);
        updatePlayerHealth(); floatingDamage(received, "#ff7777");
        if (state.playerHealth <= 0) {
          state.playerHealth = state.maxHealth; updatePlayerHealth();
          alert("Você foi derrotado e voltou ao acampamento.");
        }
      }, 500);
    }
    setTimeout(() => { state.attacking = false; }, 650);
  }
  attackButton?.addEventListener("click", attack);
  document.addEventListener("keydown", e => { if (e.code === "Space" || e.code === "KeyF") attack(); });
  document.getElementById("game-screen")?.addEventListener("click", e => {
    if (e.target === canvas && !state.enemy) chooseEnemy();
  });
  window.addEventListener("load", () => { state.maxHealth = player()?.stats?.health || 100; state.playerHealth = state.maxHealth; updatePlayerHealth(); });
})();
