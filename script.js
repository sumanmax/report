// script.js

function normalize(text) {
  return text
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')   // remove all symbols/spaces
    .replace(/0/g, 'O')          // fix common OCR errors
    .replace(/1/g, 'I');
}

function fuzzyMatch(text, keywords) {
  const normText = normalize(text);
  return keywords.some(keyword => {
    const normKeyword = normalize(keyword);
    return normText.includes(normKeyword);
  });
}

function extractValue(lines, keywords) {
  for (let line of lines) {
    if (fuzzyMatch(line, keywords)) {
      const match = line.match(/(\d[\d,]*)/);
      if (match) return match[1].replace(/,/g, '');
    }
  }
  return '0';
}

function extractAndDisplayData() {
  const rawInput = document.getElementById('input').value.toUpperCase();
  const lines = rawInput.split('\n');

  const deposit = extractValue(lines, ["TOTAL DEPOSIT", "TOTAL DEPOSITS","DEPOSITS AMOUNT","DEPOSIT AMOUNT"]);
  const withdrawal = extractValue(lines, ["TOTAL WITHDRAWAL", "WITHDRAWAL AMOUNT", "TOTAL WITHDRAW AMOUNT", "WITHDRAW AMOUNT","TOTAL WITHDRAWAL AMOUNT"]);
  const dCount = extractValue(lines, ["NO OF DEPOSIT","NUMBER OF DEPOSIT","DEPOSIT COUNT", "NUMBER DEPOSIT"]);
  const wCount = extractValue(lines, ["NO OF WITHDRAWAL","COUNT OF WITHDRAWAL","WITHDRAWAL COUNT", "NUMBER OF WITHDRAWAL"]);
  const bonus = extractValue(lines, ["BONUS", "TOTAL BONUS", "TODAY BONUS", "BONUS AMOUNT"]);
  const totalUser = extractValue(lines, ["TOTAL USER"]);

  const set = (id, val, flag) => {
    const el = document.getElementById(id);
    el.innerText = val;
    el.style.color = flag ? "red" : "black";
    el.style.fontWeight = flag ? "bold" : "normal";
  };

  set("deposit", deposit, +deposit > 2000000);
  set("withdrawal", `-${withdrawal}`, +withdrawal > 2000000);
  set("dCount", dCount, +dCount > 500);
  set("wCount", wCount, +wCount > 200);
  set("bonus", bonus, +bonus > 10000);
  set("totalUser", totalUser);
}

function copyTableData() {
  const rows = [...document.getElementById('outputTable').rows].slice(1);
  const text = rows.map(r => [...r.cells].map(c => c.innerText).join('\t')).join('\n');

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector("button[onclick='copyTableData()']");
    const originalBg = btn.style.backgroundColor;
    const originalColor = btn.style.color;

    btn.style.backgroundColor = "#4CAF50"; // Green
    btn.style.color = "#fff";

    setTimeout(() => {
      btn.style.backgroundColor = originalBg || '';
      btn.style.color = originalColor || '';
    }, 20); // 1 second
  });
}


