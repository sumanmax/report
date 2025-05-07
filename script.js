function extractAndDisplayData() {
  const input = document.getElementById('input').value;

  const labels = {
    deposit: ["TOTAL DEPOSIT", "TOTAL DEPOSITE", "DEPOSIT AMOUNT", "DEPOSITE AMOUNT"],
    withdrawal: ["TOTAL WITHDRAWAL", "WITHDRAWAL AMOUNT", "WITHDRAW AMOUNT"],
    dCount: ["NO. OF DEPOSITS"],
    wCount: ["NO. OF WITHDRAWALS"],
    bonus: ["BONUS", "TODAY BONUS", "TODAY BONUS AMOUNT", "TOTAL BONUS"],
    totalUser: ["TOTAL USER"]
  };

  // All common separators
  const separators = "\\s*(?::-₹|:-|:-₹|-₹|-:|:|=|₹|-)?\\s*";

  const getValue = keys => {
    for (let key of keys) {
      const regex = new RegExp(key.replace(/\./g, "\\.") + separators + "([\\d,]+)", "i");
      const match = input.match(regex);
      if (match) return match[1].replace(/,/g, '');
    }
    return '0';
  };

  const set = (id, val, flag) => {
    const el = document.getElementById(id);
    el.innerText = val;
    el.style.color = flag ? "red" : "black";
    el.style.fontWeight = flag ? "bold" : "normal";
  };

  const d = getValue(labels.deposit), w = getValue(labels.withdrawal), dc = getValue(labels.dCount),
        wc = getValue(labels.wCount), b = getValue(labels.bonus), u = getValue(labels.totalUser);

  set("deposit", d, +d > 2000000);
  set("withdrawal", `-${w}`, +w > 2000000);
  set("dCount", dc, +dc > 500);
  set("wCount", wc, +wc > 200);
  set("bonus", b, +b > 10000);
  set("totalUser", u);
}

function copyTableData() {
  const row = document.getElementById('outputTable').rows[1]; // Only data row
  const text = [...row.cells].map(c => c.innerText).join('\t'); // Skip headers
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector("button[onclick='copyTableData()']");
    const bg = btn.style.backgroundColor;
    btn.style.backgroundColor = "#4caf50";
    btn.style.color = "#fff";
    setTimeout(() => { btn.style.backgroundColor = bg; btn.style.color = ""; }, 20);
  });
}
