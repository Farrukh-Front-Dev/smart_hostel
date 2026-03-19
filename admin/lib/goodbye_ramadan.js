const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function typeWithCursor(text, duration) {
  const cursor = "▌";

  const length = text.length;
  const speed = duration / length;

  for (let i = 0; i < length; i++) {
    process.stdout.write("\r" + text.slice(0, i + 1) + cursor);
    await sleep(speed);
  }

  process.stdout.write("\r" + text + " \n");
}

function formatLine(speaker, text) {
  if (speaker === "Me") {
    return `\x1b[36m[Me]\x1b[0m  ${text}`;
  }
  return `\x1b[33m[Ramadan]\x1b[0m ${text}`;
}

// 🔥 NEW STRUCTURE
const lines = [
  { start: 0, end: 2000, speaker: "Ramadan", text: "I come to say goodbye." },
  { start: 2000, end: 4000, speaker: "Me", text: "Where are you going?" },
  { start: 5000, end: 8000, speaker: "Ramadan", text: "Just on a little trip." },
  { start: 9000, end: 13000, speaker: "Me", text: "Ramadan… will I ever see you again?" },
  { start: 13000, end: 16000, speaker: "Ramadan", text: "Sure, sure you will, kid." },
  { start: 17000, end: 20000, speaker: "Ramadan", text: "Goodbyes aren't forever." },
  { start: 21000, end: 25000, speaker: "Me", text: "Then… goodbye. I love you." },
  { start: 26000, end: 29000, speaker: "Ramadan", text: "I love you too." },
];

async function run() {
  console.clear();
  console.log("\x1b[2m--- Terminal Chat ---\x1b[0m\n");

  const startTime = Date.now();

  for (const line of lines) {
    const now = Date.now() - startTime;

    // ⏱️ start vaqtigacha kutamiz
    const wait = line.start - now;
    if (wait > 0) {
      await sleep(wait);
    }

    const formatted = formatLine(line.speaker, line.text);

    // 🎯 duration aniq nazoratda
    const duration = line.end - line.start;

    await typeWithCursor(formatted, duration);
  }

  console.log("\n\x1b[2m@farrukh.djumayev\x1b[0m");
}

run();