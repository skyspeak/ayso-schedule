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

  const TELLERS = ["Speedy", "Dash", "Golden Speedsters"];

  const JOKES = [
    "Why don't cheetahs play hide-and-seek? They're always spotted!",
    "How do you stop a cheetah from winning? You cheetah.",
    "What's faster than a cheetah? A cheetah who heard the Cheetos bag open.",
    "Why did the soccer shoe go to the doctor? It was under a lot of pressure.",
    "I told Dash to save me a Cheeto. He said, \"I would, but I'm a cheetah.\"",
    "Why was the soccer ball afraid of Team 01? Too many spots. Too many feet.",
    "Knock knock. Who's there? Boo. Boo who? Don't cry. We brought Cheetos.",
    "What do you call a cheetah on the bench? A waiting spot.",
    "Why can't you hear a cheetah in the bathroom? Too fast.",
    "Coach: Who wants water? Whole team: CHEETOS.",
    "What's a cheetah's favorite snack play? The crunch and run.",
    "Why did Speedy sit on the ball? He thought that's how you hatch a goal.",
    "A turtle challenged Dash to a race. Dash said, \"Okay. See you next season.\"",
    "What do Golden Cheetahs put on their pizza? Catch-up.",
    "Why did the Cheeto go to the soccer game? It heard there would be cheetahs. It was not ready.",
    "What's black, yellow, and orange? A cheetah that found the snacks.",
    "Why did the referee give Dash a card? He ran so fast the whistle got jealous.",
    "I packed 10 Cheetos for 10 cheetahs. I now pack 200.",
  ];

  let lastJoke = -1;

  function pickJoke() {
    let i = Math.floor(Math.random() * JOKES.length);
    if (i === lastJoke) i = (i + 1) % JOKES.length;
    lastJoke = i;
    return {
      who: TELLERS[Math.floor(Math.random() * TELLERS.length)],
      text: JOKES[i],
    };
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

  const jokePop = document.getElementById("joke-pop");
  const jokeWho = document.getElementById("joke-who");
  const jokeText = document.getElementById("joke-text");
  const jokeClose = document.getElementById("joke-close");

  function todayStamp() {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  }

  function nowMinutes() {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());
    const hour = Number(parts.find((part) => part.type === "hour").value);
    const minute = Number(parts.find((part) => part.type === "minute").value);
    return hour * 60 + minute;
  }

  function toMinutes(hhmm) {
    const [hour, minute] = hhmm.split(":").map(Number);
    return hour * 60 + minute;
  }

  function isPlayed(game) {
    const today = todayStamp();
    if (game.date < today) return true;
    if (game.date > today) return false;
    return nowMinutes() >= toMinutes(game.end);
  }

  function saturdayOfThisWeek() {
    const today = todayStamp();
    const [year, month, day] = today.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const weekday = date.getDay();
    const saturday = new Date(date);
    if (weekday === 0) saturday.setDate(day - 1);
    else saturday.setDate(day + (6 - weekday));
    const y = saturday.getFullYear();
    const m = String(saturday.getMonth() + 1).padStart(2, "0");
    const d = String(saturday.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function weekGame() {
    const thisSaturday = saturdayOfThisWeek();
    const thisWeek = AYSO_GAMES.find((game) => game.date === thisSaturday);
    if (thisWeek) return thisWeek;
    const today = todayStamp();
    return (
      AYSO_GAMES.find((game) => game.date >= today) ||
      AYSO_GAMES[AYSO_GAMES.length - 1]
    );
  }

  function esc(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function openJoke() {
    const joke = pickJoke();
    jokeWho.textContent = joke.who + " says";
    jokeText.textContent = joke.text;
    jokeClose.textContent = "Hehe, okay";
    jokePop.hidden = false;
    jokeClose.focus();
  }

  function openHighlights(game) {
    jokeWho.textContent = "Match highlights";
    jokeText.innerHTML = (game.highlights || [])
      .map((line, index, lines) => {
        const last = index === lines.length - 1;
        return `<span${last ? ' class="highlight-last"' : ""}>${esc(line)}</span>`;
      })
      .join("");
    jokeClose.textContent = "Nice.";
    jokePop.hidden = false;
    jokeClose.focus();
  }

  function closeJoke() {
    jokePop.hidden = true;
  }

  const focus = weekGame();
  const playedCount = AYSO_GAMES.filter(isPlayed).length;
  const sub = document.getElementById("matches-sub");
  if (sub && playedCount) {
    sub.textContent =
      playedCount === 1
        ? "Ten Saturday kickoffs at Bay Meadows · one game played, this week is up next"
        : `Ten Saturday kickoffs at Bay Meadows · ${playedCount} games played, this week is up next`;
  }

  document.getElementById("agenda").innerHTML = AYSO_GAMES.map((game) => {
    const ha = game.isHome ? "home" : "away";
    const [, month, day] = game.date.split("-");
    const played = isPlayed(game);
    const thisWeek = game.date === focus.date;
    const alert = game.alert
      ? `<p class="game-alert"><span class="bang" aria-hidden="true">!</span><span>${esc(game.alert)}</span></p>`
      : "";
    const highlights = played && game.highlights && game.highlights.length
      ? `<ul class="highlights">${game.highlights
          .map((line, index) => {
            const last = index === game.highlights.length - 1;
            return `<li${last ? ' class="highlight-last"' : ""}>${esc(line)}</li>`;
          })
          .join("")}</ul>`
      : "";
    const badge = played
      ? `<span class="badge played">played</span>`
      : `<span class="badges">${thisWeek ? `<span class="badge this-week">this week</span>` : ""}<span class="badge ${ha}">${game.isHome ? "home game" : "away game"}</span></span>`;
    const classes = [
      "game",
      ha,
      played ? "played" : "",
      thisWeek ? "this-week" : "",
    ]
      .filter(Boolean)
      .join(" ");
    return `<li>
      <button type="button" class="${classes}" data-date="${game.date}" id="week-${game.date}">
        <div class="game-top">
          <div class="when">
            <span class="dow">Saturday</span>
            <span class="day">${Number(day)}</span>
            <span class="mon">${MONTHS[Number(month) - 1]}</span>
          </div>
          ${badge}
        </div>
        ${alert}
        <div class="match-body">
          ${played ? `<span class="game-x" aria-hidden="true"><span></span><span></span></span>` : ""}
          <div class="scoreboard">
            <span class="jersey">${game.home}</span>
            <span class="versus">
              ${BALL}
              <span>vs</span>
            </span>
            <span class="jersey">${game.away}</span>
          </div>
          <div class="meta">
            <span class="kickoff">
              <span class="dow">Kickoff</span>
              <span class="kick-time">${game.startLabel}</span>
            </span>
            <span><strong>Pitch ${game.field}</strong></span>
          </div>
        </div>
        ${highlights}
        <span class="tap-hint">${played ? "Tap for highlights" : "Tap for a cheetah joke"}</span>
      </button>
    </li>`;
  }).join("");

  document.getElementById("agenda").addEventListener("click", (event) => {
    const button = event.target.closest(".game");
    if (!button) return;
    const game = AYSO_GAMES.find((item) => item.date === button.dataset.date);
    if (game && isPlayed(game) && game.highlights && game.highlights.length) {
      openHighlights(game);
      return;
    }
    openJoke();
  });

  const weekCard = document.getElementById("week-" + focus.date);
  if (weekCard) {
    requestAnimationFrame(() => {
      weekCard.scrollIntoView({ behavior: "auto", block: "start", inline: "nearest" });
    });
  }

  jokeClose.addEventListener("click", closeJoke);
  jokePop.addEventListener("click", (event) => {
    if (event.target === jokePop) closeJoke();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !jokePop.hidden) closeJoke();
  });

  const PUBLIC_ICS = "https://skyspeak.github.io/ayso-schedule/schedule.ics";
  const WEBCAL_ICS = PUBLIC_ICS.replace(/^https:/, "webcal:");
  const google =
    "https://calendar.google.com/calendar/r?cid=" + encodeURIComponent(WEBCAL_ICS);
  const apple = WEBCAL_ICS;
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
