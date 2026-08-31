(function () {
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const BALL = `<svg class="mini-ball" viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="24" r="20"/>
    <polygon points="24,16 29,20 27,26 21,26 19,20"/>
    <path d="M24 16 L24 7 M29 20 L38 16 M27 26 L34 36 M21 26 L14 36 M19 20 L10 16"/>
    <path d="M10 16 Q8 24 14 36 M38 16 Q40 24 34 36 M24 7 Q15 9 10 16 M24 7 Q33 9 38 16"/>
  </svg>`;

  function googleEventUrl(game) {
    const compact = game.date.replace(/-/g, "");
    const opp = game.isHome ? game.away : game.home;
    const ha = game.isHome ? "Home" : "Away";
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `AYSO 6U Team 01 vs ${opp} (${ha})`,
      dates: `${compact}T${game.start.replace(":", "")}00/${compact}T${game.end.replace(":", "")}00`,
      ctz: "America/Los_Angeles",
      location: `Bay Meadows Park, San Mateo, CA`,
      details: `Field ${game.field}\nMap: https://maps.app.goo.gl/Xd7wb55Gjgm9JRJG9`,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  }

  function setTheme(theme) {
    const dark = theme === "dark";
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("ayso-theme", dark ? "dark" : "light");
    const toggle = document.getElementById("theme-toggle");
    toggle.setAttribute("aria-checked", dark ? "true" : "false");
    toggle.setAttribute(
      "aria-label",
      dark ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  document.getElementById("agenda").innerHTML = AYSO_GAMES.map((game) => {
    const ha = game.isHome ? "home" : "away";
    const [, month, day] = game.date.split("-");
    return `<li>
      <a class="game ${ha}" href="${googleEventUrl(game)}" target="_blank" rel="noreferrer">
        <div class="game-top">
          <div class="when">
            <span class="dow">Saturday</span>
            <span class="day">${Number(day)}</span>
            <span class="mon">${MONTHS[Number(month) - 1]}</span>
          </div>
          <span class="badge ${ha}">${game.isHome ? "home game" : "away game"}</span>
        </div>
        <div class="scoreboard">
          <span class="jersey">${game.home}</span>
          <span class="versus">
            ${BALL}
            <span>vs</span>
          </span>
          <span class="jersey">${game.away}</span>
        </div>
        <div class="meta">
          <span><strong>Kickoff</strong> ${game.startLabel}</span>
          <span><strong>Pitch ${game.field}</strong></span>
        </div>
      </a>
    </li>`;
  }).join("");

  const PUBLIC_ICS = "https://skyspeak.github.io/ayso-schedule/schedule.ics";
  const google =
    "https://calendar.google.com/calendar/r?cid=" + encodeURIComponent(PUBLIC_ICS);
  const apple = PUBLIC_ICS.replace(/^https:/, "webcal:");
  document.getElementById("google-cal").href = google;
  document.getElementById("google-cal-footer").href = google;
  document.getElementById("apple-cal").href = apple;

  setTheme(currentTheme());
  document.getElementById("theme-toggle").addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setTheme(currentTheme() === "dark" ? "light" : "dark");
  });
})();
