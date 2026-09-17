/* Adapta o sistema atual ao catálogo expandido sem quebrar o protótipo existente. */
(function () {
  const catalog = window.RACE_CATALOG || {};

  function applyExpandedRace() {
    const selected = document.querySelector(".race-card.selected")?.dataset.race;
    const data = catalog[selected];
    const player = window.gamePlayer?.getData?.();
    if (!data || !player) return;

    player.raceId = data.id;
    player.raceName = data.name;
    player.stats = {
      health: data.health,
      mana: data.mana,
      strength: data.strength,
      defense: data.defense,
      agility: data.agility,
      intelligence: data.intelligence
    };
    player.currentHealth = data.health;
    player.currentMana = data.mana;

    document.getElementById("display-player-race")?.replaceChildren(document.createTextNode(`${data.icon} ${data.name}`));
    document.getElementById("stat-health")?.replaceChildren(document.createTextNode(data.health));
    document.getElementById("stat-mana")?.replaceChildren(document.createTextNode(data.mana));
    document.getElementById("stat-strength")?.replaceChildren(document.createTextNode(data.strength));
    document.getElementById("stat-defense")?.replaceChildren(document.createTextNode(data.defense));
    document.getElementById("stat-agility")?.replaceChildren(document.createTextNode(data.agility));
    document.getElementById("stat-intelligence")?.replaceChildren(document.createTextNode(data.intelligence));

    window.applyCharacterAppearance?.({
      name: player.name,
      race: data.base,
      skinColor: player.skinColor,
      hairColor: player.hairColor,
      clothColor: player.clothColor,
      weapon: player.weapon || player.equippedWeapon || "bow"
    });

    try { localStorage.setItem("kingdoms_expanded_race", data.id); } catch (_) {}
  }

  document.addEventListener("click", (event) => {
    const card = event.target.closest?.(".race-card");
    if (!card) return;
    document.querySelectorAll(".race-card").forEach(item => item.classList.toggle("selected", item === card));
  });

  document.getElementById("create-character-button")?.addEventListener("click", () => {
    setTimeout(applyExpandedRace, 40);
  });

  window.addEventListener("load", () => {
    setTimeout(applyExpandedRace, 100);
  });
})();
