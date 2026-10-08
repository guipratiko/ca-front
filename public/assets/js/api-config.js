/* Base pública da API (sem segredos). */
(function () {
  var host = (typeof location !== "undefined" && location.hostname) || "";
  var isLocal = host === "localhost" || host === "127.0.0.1" || host === "";
  window.CA_API_BASE = isLocal
    ? "http://localhost:8787"
    : "https://api.cacurso.com.br";
})();
