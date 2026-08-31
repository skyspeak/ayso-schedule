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
    "What do Golden Cheetahs eat at halftime? Cheetos. For extra cheetah power.",
    "Knock knock. Who's there? Cheetah. Cheetah who? Cheetahs never knock. They zoom in!",
    "Dash tried to race the soccer ball. The ball said, \"Hey, that's MY job!\"",
    "Why did the Cheeto come to Bay Meadows? To hang out with the cheetahs!",
    "What's a cheetah's favorite drink? Cheetah-ade.",
    "I packed Cheetos for the game. They vanished before kickoff. Speedy looked very innocent.",
    "Why don't cheetahs make good goalies? They run so fast they score on themselves.",
    "What's orange, crunchy, and trying to keep up? A Cheeto chasing Dash.",
    "If you hear ZOOM, that's not a plane. That's Team 01.",
    "Cheetahs can run 70 miles an hour. Our team can eat 70 Cheetos an hour.",
    "What do you call a cheetah with a soccer ball? A Golden Speedster.",
    "Coach asked who was fastest. The whole team yelled ME! That's the cheetah spirit.",
    "Why did Speedy bring extra socks? Fast feet. Faster stink.",
    "Dash's favorite soccer move is the dash. Speedy's favorite snack is... also the dash to the Cheetos.",
    "What did the soccer ball say to the cheetah? \"Tag, you're it... forever!\"",
    "Pitch A and Pitch B are both at the same park. The cheetahs still race there. Just in case.",
    "Why was the cheetah so good at soccer? Because nobody could ketchup. Except the Cheetos.",
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

  function openJoke() {
    const joke = pickJoke();
    jokeWho.textContent = joke.who + " says";
    jokeText.textContent = joke.text;
    jokePop.hidden = false;
    jokeClose.focus();
  }

  function closeJoke() {
    jokePop.hidden = true;
  }

  document.getElementById("agenda").innerHTML = AYSO_GAMES.map((game) => {
    const ha = game.isHome ? "home" : "away";
    const [, month, day] = game.date.split("-");
    return `<li>
      <button type="button" class="game ${ha}">
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
          <span class="kickoff">
            <span class="dow">Kickoff</span>
            <span class="day">${game.startLabel}</span>
          </span>
          <span><strong>Pitch ${game.field}</strong></span>
        </div>
        <span class="tap-hint">Tap for a cheetah joke</span>
      </button>
    </li>`;
  }).join("");

  document.getElementById("agenda").addEventListener("click", (event) => {
    if (event.target.closest(".game")) openJoke();
  });

  jokeClose.addEventListener("click", closeJoke);
  jokePop.addEventListener("click", (event) => {
    if (event.target === jokePop) closeJoke();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !jokePop.hidden) closeJoke();
  });

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
