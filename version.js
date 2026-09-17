/* Limpa saves antigos quando o jogador pede uma nova versão de teste. */
(function () {
  const version = "0.2.0";
  const key = "kingdoms_build_version";
  if (localStorage.getItem(key) !== version) {
    localStorage.setItem(key, version);
  }
})();
