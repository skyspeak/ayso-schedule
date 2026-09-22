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

  const LINES = [
    { kind: "joke", text: "Why don't cheetahs play freeze tag? They would rather not." },
    { kind: "joke", text: "Coach blew the whistle. Dash was already in the snack line." },
    { kind: "joke", text: "What's a cheetah's favorite position? Wherever the ball used to be." },
    { kind: "joke", text: "A turtle challenged Dash. Dash said, \"Text me when you get to midfield.\"" },
    { kind: "joke", text: "I asked Speedy to go slow. He whispered, \"I don't know how.\"" },
    { kind: "joke", text: "Why did the soccer ball hide? It heard ten cheetahs coming." },
    { kind: "joke", text: "Referee: Offsides. Cheetah: I wasn't offsides. I was early." },
    { kind: "joke", text: "How can you tell Golden Cheetahs were here? Orange fingerprints. And a breeze." },
    { kind: "joke", text: "Knock knock. Who's there? Cheetah. Cheetah who? Cheetahs never knock. They're already inside." },
    { kind: "joke", text: "What's louder than a Cheetos bag? A cheetah who heard the Cheetos bag." },
    { kind: "joke", text: "Why do cheetahs make terrible spies? Spots. Also they arrive before the secret." },
    { kind: "joke", text: "Speedy's game plan: 1. Run. 2. Run. 3. Ask where the Cheetos went." },
    { kind: "joke", text: "I packed ten Cheetos for ten cheetahs. I now pack two hundred." },
    { kind: "joke", text: "Coach: Who wants water? Whole team, already orange: CHEETOS." },
    { kind: "fact", text: "The orange dust on Cheetos has a real name. It's called cheetle." },
    { kind: "fact", text: "Cheetos started in 1948 as Crunchy. Puffs did not show up until 1971." },
    { kind: "fact", text: "They used to be spelled Chee-tos, with a little hyphen in the middle." },
    { kind: "fact", text: "Before Chester Cheetah, the mascot was a mouse in a three-piece suit." },
    { kind: "fact", text: "Chester Cheetah showed up in 1986. His old line was, \"It ain't easy bein' cheesy.\"" },
    { kind: "fact", text: "Japan has sold strawberry Cheetos. Also Pepsi-flavored Cheetos." },
    { kind: "fact", text: "Cheetos are sold in more than 36 countries, and the flavors change to match the place." },
    { kind: "fact", text: "From cornmeal to crunch, a Cheeto takes about 19 minutes to make." },
  ];

  let lastLine = -1;

  function pickLine() {
    let i = Math.floor(Math.random() * LINES.length);
    if (i === lastLine) i = (i + 1) % LINES.length;
    lastLine = i;
    const line = LINES[i];
    if (line.kind === "fact") {
      return {
        who: "Cheeto fact",
        text: line.text,
        close: "Orange fingers",
      };
    }
    return {
      who: TELLERS[Math.floor(Math.random() * TELLERS.length)] + " says",
      text: line.text,
      close: "Hehe, okay",
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
    const line = pickLine();
    jokeWho.textContent = line.who;
    jokeText.textContent = line.text;
    jokeClose.textContent = line.close;
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
    const body = `
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
        <span class="tap-hint">${played ? "Tap for highlights" : "Tap for a joke or a Cheeto fact"}</span>`;
    if (game.poll) {
      return `<li>
        <div class="${classes} has-rsvp" id="week-${game.date}">
          <button type="button" class="game-tap" data-date="${game.date}">
            ${body}
          </button>
          <div class="rsvp" data-date="${game.date}"></div>
        </div>
      </li>`;
    }
    return `<li>
      <button type="button" class="${classes}" data-date="${game.date}" id="week-${game.date}">
        ${body}
      </button>
    </li>`;
  }).join("");

  document.getElementById("agenda").addEventListener("click", (event) => {
    if (event.target.closest(".rsvp")) return;
    const button = event.target.closest(".game-tap, button.game");
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

  initPoll();

  function initPoll() {
    const games = AYSO_GAMES.filter((game) => game.poll);
    const agenda = document.getElementById("agenda");
    if (!games.length || !agenda || !agenda.querySelector(".rsvp")) return;

    const API = "https://crudcrud.com/api/a7d8d8b81601429380b88bb9f14d4675/votes";
    const STORE = "ayso-poll-v1";
    const CHOICES = ["yes", "no"];

    let self = null;
    let votes = [];
    let draft = {};
    let statusText = "";
    let chain = Promise.resolve();
    let lastFetch = 0;

    function uid() {
      if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
      return "p-" + Date.now().toString(36) + Math.random().toString(36).slice(2);
    }

    function nowStamp() {
      return Math.floor(Date.now() / 1000);
    }

    function stamp(value) {
      const n = Number(value) || 0;
      return n > 1e11 ? Math.floor(n / 1000) : n;
    }

    function loadLocal() {
      try {
        const raw = JSON.parse(localStorage.getItem(STORE) || "null");
        if (!raw || typeof raw !== "object") return;
        if (validVote(raw.self)) self = normalize(raw.self);
        if (Array.isArray(raw.votes)) votes = raw.votes.map(normalize).filter(Boolean);
      } catch (err) {
        self = null;
        votes = [];
      }
    }

    function saveLocal() {
      localStorage.setItem(STORE, JSON.stringify({ self, votes }));
    }

    function validVote(vote) {
      return Boolean(vote && typeof vote.clientId === "string" && typeof vote.name === "string" && vote.name.trim());
    }

    function blankAnswers() {
      const answers = {};
      games.forEach((game) => {
        answers[game.date] = "";
      });
      return answers;
    }

    function cleanAnswers(answers) {
      const next = blankAnswers();
      games.forEach((game) => {
        const value = answers && answers[game.date];
        next[game.date] = CHOICES.includes(value) ? value : "";
      });
      return next;
    }

    function normalize(vote) {
      if (!validVote(vote)) return null;
      return {
        clientId: vote.clientId,
        recordId: vote.recordId || vote._id || "",
        name: String(vote.name).trim().replace(/\s+/g, " ").slice(0, 32),
        createdAt: stamp(vote.createdAt),
        updatedAt: stamp(vote.updatedAt),
        pending: Boolean(vote.pending),
        answers: cleanAnswers(vote.answers),
      };
    }

    function payload(vote) {
      return {
        clientId: vote.clientId,
        name: vote.name,
        createdAt: vote.createdAt,
        updatedAt: vote.updatedAt,
        answers: cleanAnswers(vote.answers),
      };
    }

    function queue(task) {
      chain = chain.then(task, task);
      return chain;
    }

    function setStatus(text) {
      statusText = text;
      document.querySelectorAll(".rsvp-status").forEach((node) => {
        node.textContent = text;
      });
    }

    function answerFor(vote, date) {
      const value = vote && vote.answers && vote.answers[date];
      return value === "yes" || value === "no" ? value : "";
    }

    function listed() {
      const list = votes.filter(Boolean).slice();
      list.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      if (!self) return list;
      const rest = list.filter((vote) => vote.clientId !== self.clientId);
      const mine = list.find((vote) => vote.clientId === self.clientId) || self;
      return [mine, ...rest];
    }

    function render() {
      const typing = document.activeElement && document.activeElement.classList.contains("rsvp-name")
        ? document.activeElement
        : null;
      const typedValue = typing ? typing.value : "";
      const typedDate = typing && typing.closest(".rsvp") ? typing.closest(".rsvp").dataset.date : "";
      const people = listed();

      document.querySelectorAll(".rsvp").forEach((slot) => {
        const date = slot.dataset.date;
        const mine = self ? answerFor(self, date) : (draft[date] || "");
        const others = people.filter((vote) => {
          if (self && vote.clientId === self.clientId) return false;
          return answerFor(vote, date);
        });
        let yes = people.filter((vote) => answerFor(vote, date) === "yes").length;
        let no = people.filter((vote) => answerFor(vote, date) === "no").length;
        if (!self && mine === "yes") yes += 1;
        if (!self && mine === "no") no += 1;
        const who = self
          ? `<p class="rsvp-you"><span>${esc(self.name)}</span><button type="button" class="rsvp-remove" data-remove>Remove</button></p>`
          : `<form class="rsvp-join">
              <input class="rsvp-name" maxlength="32" autocomplete="name" placeholder="Your name" aria-label="Your name" required />
              <button class="btn primary" type="submit">Add me</button>
            </form>`;
        const list = others.length
          ? `<ul class="rsvp-people">${others.map((vote) => {
              const answer = answerFor(vote, date);
              return `<li><span>${esc(vote.name)}</span><span class="rsvp-word ${answer}">${answer === "yes" ? "Yes" : "No"}</span></li>`;
            }).join("")}</ul>`
          : "";
        const statusLine = statusText ? `<p class="rsvp-status" role="status">${esc(statusText)}</p>` : "";
        slot.innerHTML = `
          <p class="rsvp-label">RSVP</p>
          ${who}
          <div class="rsvp-picks">
            <button type="button" class="rsvp-pick yes${mine === "yes" ? " is-on" : ""}" data-choice="yes" aria-pressed="${mine === "yes"}">Yes</button>
            <button type="button" class="rsvp-pick no${mine === "no" ? " is-on" : ""}" data-choice="no" aria-pressed="${mine === "no"}">No</button>
          </div>
          ${list}
          <p class="rsvp-count"><strong>${yes}</strong> yes · <strong>${no}</strong> no</p>
          ${statusLine}
        `;
      });

      if (typedDate) {
        const input = document.querySelector('.rsvp[data-date="' + typedDate + '"] .rsvp-name');
        if (input) {
          input.value = typedValue;
          input.focus();
        }
      }
    }

    async function request(url, options) {
      const response = await fetch(url, {
        cache: "no-store",
        ...options,
        headers: {
          Accept: "application/json",
          ...(options && options.body ? { "Content-Type": "application/json" } : {}),
        },
      });
      if (!response.ok) throw new Error(String(response.status));
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    }

    function mergeRemote(remote) {
      const incoming = (Array.isArray(remote) ? remote : []).map(normalize).filter(Boolean);
      const byId = new Map();
      incoming.forEach((vote) => byId.set(vote.clientId, vote));
      if (self) {
        const remoteSelf = byId.get(self.clientId);
        if (remoteSelf && !self.recordId) self.recordId = remoteSelf.recordId;
        const keepLocal = !remoteSelf || self.updatedAt >= remoteSelf.updatedAt;
        if (keepLocal) {
          byId.set(self.clientId, {
            ...self,
            recordId: self.recordId || (remoteSelf && remoteSelf.recordId) || "",
          });
        } else {
          self = { ...remoteSelf, pending: false };
        }
      }
      votes = [...byId.values()];
      saveLocal();
    }

    async function refresh() {
      const remote = await request(API);
      lastFetch = Date.now();
      mergeRemote(remote);
      render();
    }

    async function pushSelf() {
      if (!self) return;
      const body = JSON.stringify(payload(self));
      if (!self.recordId) {
        const created = await request(API, { method: "POST", body });
        if (created && created._id) self.recordId = created._id;
        self.pending = false;
        saveLocal();
        return;
      }
      try {
        await request(API + "/" + self.recordId, { method: "PUT", body });
      } catch (err) {
        if (err && err.message === "404") {
          self.recordId = "";
          await pushSelf();
          return;
        }
        throw err;
      }
      self.pending = false;
      saveLocal();
    }

    function rememberSelf() {
      votes = votes.filter((vote) => vote.clientId !== self.clientId).concat({ ...self });
      saveLocal();
      render();
    }

    function join(name) {
      const now = nowStamp();
      const answers = blankAnswers();
      Object.keys(draft).forEach((date) => {
        if (answers[date] !== undefined && (draft[date] === "yes" || draft[date] === "no")) {
          answers[date] = draft[date];
        }
      });
      draft = {};
      self = {
        clientId: uid(),
        recordId: "",
        name,
        createdAt: now,
        updatedAt: now,
        pending: true,
        answers,
      };
      rememberSelf();
      setStatus("Saving…");
      queue(async () => {
        try {
          await pushSelf();
          await refresh();
          setStatus("Saved. Anyone with this page can see it.");
        } catch (err) {
          setStatus("Saved on this phone. Couldn't reach the shared poll.");
        }
      });
    }

    agenda.addEventListener("submit", (event) => {
      const form = event.target.closest(".rsvp-join");
      if (!form) return;
      event.preventDefault();
      const name = form.querySelector(".rsvp-name").value.trim().replace(/\s+/g, " ").slice(0, 32);
      if (!name || self) return;
      join(name);
    });

    agenda.addEventListener("click", (event) => {
      const slot = event.target.closest(".rsvp");
      if (!slot) return;
      event.stopPropagation();
      const date = slot.dataset.date;
      if (!games.some((game) => game.date === date)) return;

      if (event.target.closest("[data-remove]") && self) {
        const recordId = self.recordId;
        const clientId = self.clientId;
        self = null;
        draft = {};
        votes = votes.filter((vote) => vote.clientId !== clientId);
        saveLocal();
        render();
        const input = document.querySelector(".rsvp-name");
        if (input) input.focus();
        setStatus("Removing…");
        queue(async () => {
          try {
            if (recordId) await request(API + "/" + recordId, { method: "DELETE" });
            await refresh();
            setStatus(votes.length ? "Removed." : "");
          } catch (err) {
            setStatus("Removed on this phone. Couldn't reach the shared poll.");
          }
        });
        return;
      }

      const pick = event.target.closest("[data-choice]");
      if (!pick) return;
      const choice = pick.dataset.choice === "no" ? "no" : "yes";
      if (!self) {
        draft[date] = draft[date] === choice ? "" : choice;
        render();
        const input = document.querySelector('.rsvp[data-date="' + date + '"] .rsvp-name');
        if (input) input.focus();
        return;
      }
      self.answers = {
        ...self.answers,
        [date]: answerFor(self, date) === choice ? "" : choice,
      };
      self.updatedAt = nowStamp();
      self.pending = true;
      rememberSelf();
      queue(async () => {
        try {
          await pushSelf();
          setStatus("Saved. Anyone with this page can see it.");
        } catch (err) {
          setStatus("Saved on this phone. Couldn't reach the shared poll.");
        }
      });
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastFetch < 20000) return;
      queue(async () => {
        try {
          if (self && self.pending) await pushSelf();
          await refresh();
          setStatus("Anyone with this page can see these answers.");
        } catch (err) {
          if (!statusText) setStatus("Couldn't reach the shared poll.");
        }
      });
    });

    loadLocal();
    render();
    setStatus("Checking who's answered…");
    queue(async () => {
      const localSelf = self
        ? { ...self, answers: { ...self.answers } }
        : null;
      try {
        const remote = await request(API);
        lastFetch = Date.now();
        const incoming = (Array.isArray(remote) ? remote : []).map(normalize).filter(Boolean);
        const remoteSelf = localSelf
          ? incoming.find((vote) => vote.clientId === localSelf.clientId)
          : null;
        const localNewer = Boolean(
          localSelf && (!remoteSelf || localSelf.updatedAt > remoteSelf.updatedAt)
        );
        mergeRemote(remote);
        render();
        if (localNewer && self) {
          self.answers = localSelf.answers;
          self.updatedAt = localSelf.updatedAt;
          self.pending = true;
          if (remoteSelf && !self.recordId) self.recordId = remoteSelf.recordId;
          await pushSelf();
          await refresh();
        }
        setStatus(votes.length ? "Anyone with this page can see these answers." : "");
      } catch (err) {
        setStatus(votes.length ? "Showing answers saved on this phone." : "Couldn't reach the shared poll.");
      }
    });
  }
})();
