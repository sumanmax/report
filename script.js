// ===================== TEXT NORMALIZATION & FUZZY MATCHING =====================
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

// ===================== DATA EXTRACTION =====================
function extractValue(lines, keywords) {
  for (let line of lines) {
    if (fuzzyMatch(line, keywords)) {
      const match = line.match(/(\d[\d,]*)/);
      if (match) return match[1].replace(/,/g, '');
    }
  }
  return '0';
}

function extractDateFromText(text) {
  const rawMatch = text.match(/\bdate\b[\W_]*[:\-]?\s*(.+)/i);
  const rawDate = rawMatch ? rawMatch[1].trim() : null;
  if (!rawDate) return null;

  const normalizeDate = d => {
    const m = d.match(/(\d{1,4})[\/\-](\d{1,2})[\/\-](\d{1,4})/);
    if (!m) return null;
    const [p1, p2, p3] = [m[1], m[2], m[3]].map(x => x.padStart(2, '0'));
    return p1.length === 4 ? `${p1}-${p2}-${p3}` : `${p3}-${p2}-${p1}`;
  };

  return normalizeDate(rawDate);
}

function extractBranchName(text) {
  const match = text.match(/\b(branch name)\b[\W_]*[:\-]?\s*([^\n]+)/i);
  return match ? match[2].trim().replace(/[^a-zA-Z0-9 ]/g, "") : "Unknown";
}

function extractAndDisplayData() {
  const rawInput = document.getElementById('input').value;
  const selectedDate = document.getElementById('reportDate').value;
  const lines = rawInput.toUpperCase().split('\n');

  const inputDate = extractDateFromText(rawInput);
  if (inputDate !== selectedDate) {
    reset();
    return;
  }

  const deposit = extractValue(lines, ["TOTAL DEPOSIT", "TOTAL DEPOSITS", "DEPOSITS AMOUNT", "DEPOSIT AMOUNT"]);
  const withdrawal = extractValue(lines, ["TOTAL WITHDRAWAL", "WITHDRAWAL AMOUNT", "TOTAL WITHDRAW AMOUNT", "WITHDRAW AMOUNT", "TOTAL WITHDRAWAL AMOUNT"]);
  const dCount = extractValue(lines, ["NO OF DEPOSIT", "NUMBER OF DEPOSIT", "DEPOSIT COUNT", "NUMBER DEPOSIT"]);
  const wCount = extractValue(lines, ["NO OF WITHDRAWAL", "COUNT OF WITHDRAWAL", "WITHDRAWAL COUNT", "NUMBER OF WITHDRAWAL"]);
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

  const branchName = extractBranchName(rawInput);
  document.getElementById("branch").innerText = branchName;
}

function reset() {
  ["deposit", "withdrawal", "dCount", "wCount", "bonus", "totalUser"].forEach(id => {
    const el = document.getElementById(id);
    el.innerText = "0";
    el.style.color = "black";
    el.style.fontWeight = "normal";
  });
  document.getElementById("branch").innerText = "";
}

function copyTableData() {
  const rows = [...document.getElementById('outputTable').rows].slice(1);
  const text = rows.map(r => [...r.cells].map(c => c.innerText).join('\t')).join('\n');

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector("button[onclick='copyTableData()']");
    const originalBg = btn.style.backgroundColor;
    const originalColor = btn.style.color;

    btn.style.backgroundColor = "#4CAF50";
    btn.style.color = "#fff";

    setTimeout(() => {
      btn.style.backgroundColor = originalBg || '';
      btn.style.color = originalColor || '';
    }, 23);
  });
}

// ===================== LOGIN SYSTEM =====================
window.onload = function () {
  if (localStorage.getItem("isLoggedIn") === "true") {
    showMainContent();
  } else {
    showLoginScreen();
  }

  document.addEventListener("keydown", function (e) {
    const loginVisible = document.getElementById("loginScreen").style.display !== "none";
    if (e.key === "Enter" && loginVisible) {
      checkLogin();
    }
  });
};

function checkLogin() {
  const userId = document.getElementById("userId").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  if (userId === "SKY360","sky360" && password === "Max07") {
    localStorage.setItem("isLoggedIn", "true");
    showMainContent();
  } else {
    errorMsg.textContent = "Invalid User ID or Password!";
  }
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  location.reload();
}

function showMainContent() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("mainContent").style.display = "block";
}

function showLoginScreen() {
  document.getElementById("loginScreen").style.display = "flex";
  document.getElementById("mainContent").style.display = "none";
}
