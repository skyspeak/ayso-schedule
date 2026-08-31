(function () {
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function icsHref() {
    const path = location.pathname.endsWith("/")
      ? location.pathname
      : location.pathname.replace(/[^/]+$/, "");
    return `${location.origin}${path}schedule.ics`;
  }

  function googleDates(game) {
    const compact = game.date.replace(/-/g, "");
    const start = game.start.replace(":", "") + "00";
    const end = game.end.replace(":", "") + "00";
    return `${compact}T${start}/${compact}T${end}`;
  }

  function opponent(game) {
    return game.isHome ? game.away : game.home;
  }

  function mapsUrl(field) {
    const q = encodeURIComponent(
      `Bay Meadows Park Field ${field}, 2000 Franklin Parkway, San Mateo, CA`
    );
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }

  function googleEventUrl(game) {
    const opp = opponent(game);
    const ha = game.isHome ? "Home" : "Away";
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `AYSO 6U Team 01 vs ${opp} (${ha})`,
      dates: googleDates(game),
      ctz: "America/Los_Angeles",
      location: `Bay Meadows - Field ${game.field}, 2000 Franklin Parkway, San Mateo, CA 94403`,
      details: `AYSO 6U soccer\nTeam ${game.home} vs Team ${game.away}\n${ha} game for Team 01\nBay Meadows Field ${game.field}`,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  function renderGames() {
    const root = document.getElementById("agenda");
    root.innerHTML = AYSO_GAMES.map((game) => {
      const [year, month, day] = game.date.split("-");
      const ha = game.isHome ? "Home" : "Away";
      const badgeClass = game.isHome ? "home" : "away";
      return `
        <article class="game" id="game-${game.id}">
          <div class="clipping">
            <img src="${game.image}" alt="Original schedule row for ${game.weekday}, ${MONTHS[Number(month) - 1]} ${Number(day)}, ${year}: Team ${game.home} vs Team ${game.away} at Bay Meadows Field ${game.field}." />
          </div>
          <div class="game-body">
            <div class="game-top">
              <div class="date-block">
                <div class="day-num">${Number(day)}</div>
                <div class="date-words">
                  <strong>${game.weekday}</strong>
                  ${MONTHS[Number(month) - 1]} ${year}
                </div>
              </div>
              <span class="badge ${badgeClass}">${ha}</span>
            </div>
            <div class="matchup">
              <span>${game.home}</span>
              <span class="vs">vs</span>
              <span>${game.away}</span>
            </div>
            <div class="facts">
              <div><strong>${game.startLabel} – ${game.endLabel}</strong><br />Pacific Time</div>
              <div><strong>Bay Meadows — Field ${game.field}</strong><br />San Mateo, CA</div>
            </div>
            <div class="game-actions">
              <a class="linkish" href="${googleEventUrl(game)}" target="_blank" rel="noreferrer">Add this game to Google Calendar</a>
              <a class="linkish" href="${mapsUrl(game.field)}" target="_blank" rel="noreferrer">Open map</a>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  function wireCalendarLinks() {
    const url = icsHref();
    const google =
      "https://calendar.google.com/calendar/r?cid=" + encodeURIComponent(url);
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
  }

  renderGames();
  wireCalendarLinks();
})();
