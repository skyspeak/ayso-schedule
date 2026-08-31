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

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ayso-theme", theme);
    const url = new URL(location.href);
    url.searchParams.set("theme", theme);
    history.replaceState(null, "", url);
    const next = theme === "dark" ? "light" : "dark";
    document.getElementById("theme-toggle").setAttribute(
      "aria-label",
      next === "dark" ? "Switch to dark mode" : "Switch to light mode"
    );
  }

  document.getElementById("agenda").innerHTML = AYSO_GAMES.map((game) => {
    const ha = game.isHome ? "home" : "away";
    return `<li>
      <a class="game" href="${googleEventUrl(game)}" target="_blank" rel="noreferrer">
        <span class="when">${dateLabel(game)}</span>
        <span class="clock">${game.startLabel}–${game.endLabel}</span>
        <span class="match">
          <span>${game.home}</span>
          <span class="v">v</span>
          <span>${game.away}</span>
        </span>
        <span class="field">Field ${game.field}</span>
        <span class="badge ${ha}">${ha}</span>
      </a>
    </li>`;
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
      window.prompt("Copy this calendar link", url);
    }
  });

  setTheme(currentTheme());
  document.getElementById("theme-toggle").addEventListener("click", () => {
    setTheme(currentTheme() === "dark" ? "light" : "dark");
  });
})();
