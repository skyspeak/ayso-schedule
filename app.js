(function () {
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function icsHref() {
    const path = location.pathname.endsWith("/")
      ? location.pathname
      : location.pathname.replace(/[^/]+$/, "");
    return `${location.origin}${path}schedule.ics`;
  }

  function googleEventUrl(game) {
    const compact = game.date.replace(/-/g, "");
    const opp = game.isHome ? game.away : game.home;
    const ha = game.isHome ? "Home" : "Away";
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `AYSO 6U Team 01 vs ${opp} (${ha})`,
      dates: `${compact}T${game.start.replace(":", "")}00/${compact}T${game.end.replace(":", "")}00`,
      ctz: "America/Los_Angeles",
      location: `Bay Meadows - Field ${game.field}, 2000 Franklin Parkway, San Mateo, CA 94403`,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  function dateLabel(game) {
    const [, month, day] = game.date.split("-");
    return `${game.weekday} ${MONTHS[Number(month) - 1]} ${Number(day)}`;
  }

  document.getElementById("agenda").innerHTML = AYSO_GAMES.map((game) => {
    const ha = game.isHome ? "Home" : "Away";
    return `<tr>
      <td>${dateLabel(game)}</td>
      <td>${game.startLabel}–${game.endLabel}</td>
      <td class="match">${game.home} vs ${game.away}</td>
      <td>Field ${game.field}</td>
      <td><span class="badge ${game.isHome ? "home" : "away"}">${ha}</span>
        <a class="add" href="${googleEventUrl(game)}" target="_blank" rel="noreferrer">Add</a></td>
    </tr>`;
  }).join("");

  const url = icsHref();
  const google = "https://calendar.google.com/calendar/r?cid=" + encodeURIComponent(url);
  const apple = url.replace(/^https:/, "webcal:").replace(/^http:/, "webcal:");
  document.getElementById("google-cal").href = google;
  document.getElementById("google-cal-footer").href = google;
  document.getElementById("apple-cal").href = apple;
  document.getElementById("ics-url").textContent = url;
  document.getElementById("copy-url").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(url);
      document.getElementById("copy-url").textContent = "Copied";
    } catch {
      window.prompt("Copy this ICS URL", url);
    }
  });
})();
