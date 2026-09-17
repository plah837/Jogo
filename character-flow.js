/* Fluxo funcional: 50+ raças, prévia da skin e confirmação antes de entrar. */
(function () {
  const catalog = window.RACE_CATALOG || {};
  const grid = document.querySelector('.race-options');
  const search = document.getElementById('race-search');
  const info = document.getElementById('selected-race-info');
  const skinInputs = ['skin-color','hair-color','cloth-color'].map(id => document.getElementById(id));
  const preview = { avatar:document.getElementById('skin-preview-avatar'), face:document.getElementById('skin-preview-face'), hair:document.getElementById('skin-preview-hair'), cloth:document.getElementById('skin-preview-cloth'), name:document.getElementById('skin-preview-name') };
  const create = document.getElementById('create-character-button');
  const modal = document.getElementById('confirm-modal');
  const confirm = document.getElementById('confirm-create');
  const cancel = document.getElementById('cancel-create');
  let approved = false;

  function selected() { return document.querySelector('.race-card.selected')?.dataset.race || 'elfo'; }
  function updatePreview() {
    if (preview.face && skinInputs[0]) preview.face.style.background = skinInputs[0].value;
    if (preview.hair && skinInputs[1]) preview.hair.style.background = skinInputs[1].value;
    if (preview.avatar && skinInputs[2]) preview.avatar.style.background = skinInputs[2].value;
    if (preview.cloth && skinInputs[2]) preview.cloth.style.background = skinInputs[2].value;
    const data = catalog[selected()];
    if (data && preview.name) preview.name.textContent = `${data.icon} ${data.name}`;
    if (data && info) info.textContent = `${data.icon} ${data.name} · ${data.trait} · Vida ${data.health} · Mana ${data.mana}`;
  }
  function selectCard(card) { document.querySelectorAll('.race-card').forEach(item => item.classList.toggle('selected', item === card)); updatePreview(); }
  grid?.addEventListener('click', event => { const card = event.target.closest('.race-card'); if (card) selectCard(card); });
  search?.addEventListener('input', () => { const query = search.value.toLowerCase(); document.querySelectorAll('.race-card').forEach(card => { card.hidden = !card.textContent.toLowerCase().includes(query); }); });
  skinInputs.forEach(input => input?.addEventListener('input', updatePreview));
  create?.addEventListener('click', event => { if (approved) { approved = false; return; } event.preventDefault(); event.stopImmediatePropagation(); modal?.classList.remove('hidden'); }, true);
  cancel?.addEventListener('click', () => modal?.classList.add('hidden'));
  confirm?.addEventListener('click', () => { modal?.classList.add('hidden'); approved = true; create?.click(); });
  updatePreview();
})();
