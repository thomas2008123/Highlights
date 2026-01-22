let highlights = [];
let selectedIndex = null;

const userSelect = document.getElementById("user");
const statusSelect = document.getElementById("status");
const groupSelect = document.getElementById("group");
const categorySelect = document.getElementById("category");
const activitySelect = document.getElementById("activity");
const detailsInput = document.getElementById("details");
const dateInput = document.getElementById("date");


/* ---------- PRESENT DATA ---------- */
function loadHighlights() {
  renderTable(highlights);
}

function renderTable(data) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.user}</td>
      <td>${item.status}</td>
      <td>${item.group}</td>
      <td>${item.details}</td>
      <td>${item.date}</td>
      <td>${item.category}</td>
      <td>${item.activity}</td>
    `;
    row.onclick = () => selectRow(index);
    tbody.appendChild(row);
  });
}

/* ---------- SELECT ROW ---------- */
function selectRow(index) {
  selectedIndex = index;
  const item = highlights[index];

  userSelect.value = item.user;
  statusSelect.value = item.status;
  groupSelect.value = item.group;
  detailsInput.value = item.details;
  dateInput.value = item.date;
  categorySelect.value = item.category;
  activitySelect.value = item.activity;
}


/* ---------- FORM CONTROLS ---------- */
function newEntry() {
  document.getElementById("myForm").reset();
  selectedIndex = null;
}

function saveEntry() {
  const entry = {
    user: userSelect.value,
    status: statusSelect.value,
    group: groupSelect.value,
    details: detailsInput.value,
    date: dateInput.value,
    category: categorySelect.value,
    activity: activitySelect.value || "Saved"
  };

  selectedIndex === null
    ? highlights.push(entry)
    : highlights[selectedIndex] = entry;

  renderTable(highlights);
  downloadCSV();
}


function deleteEntry() {
  if (selectedIndex === null) return;
  highlights.splice(selectedIndex, 1);
  selectedIndex = null;
  renderTable(highlights);
  downloadCSV();
}

function cancelEntry() {
  document.getElementById("myForm").reset();
  selectedIndex = null;
}

/* ---------- CSV EXPORT ---------- */
function downloadCSV() {
  let csv = "User,Status,Group,Details,Date,Category,Activity\n";
  highlights.forEach(h => {
    csv += `${h.user},${h.status},${h.group},${h.details},${h.date},${h.category},${h.activity}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "highlights.csv";
  link.click();
}

/* ---------- CSV IMPORT ---------- */
function csvToArray(csv) {
  const lines = csv.trim().split("\n").slice(1);
  return lines.map(line => {
    const [user,status,group,details,date,category,activity] = line.split(",");
    return { user,status,group,details,date,category,activity };
  });
}

document.getElementById("csvFile")?.addEventListener("change", function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
    highlights = csvToArray(event.target.result);
    renderTable(highlights);
  };

  reader.readAsText(file);
});

/* ---------- SAMPLE DATA (FOR TESTING) ---------- */
function populateSelect(selectId, options) {
  const select = document.getElementById(selectId);

  options.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    select.appendChild(option);
  });
}

fetch("../database/options.csv")
  .then(res => res.text())
  .then(text => {
    const lines = text.trim().split("\n").slice(1);

    const data = {
      user: [],
      status: [],
      group: [],
      category: [],
      activity: []
    };

    lines.forEach(line => {
  const [type, value] = line.split(",");
  const key = type.toLowerCase().trim();

  if (data[key]) {
    data[key].push(value.trim());
  }
});


    populateSelect("user", data.user);
    populateSelect("status", data.status);
    populateSelect("group", data.group);
    populateSelect("category", data.category);
    populateSelect("activity", data.activity)
  });
