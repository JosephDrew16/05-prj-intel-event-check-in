const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCountDisplay = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const celebration = document.getElementById("celebration");
const attendeeList = document.getElementById("attendeeList");
const emptyAttendees = document.getElementById("emptyAttendees");

const maxAttendees = 50;
const storageKey = "intelSummitCheckIn";
let attendeeCount = 0;
let waterCount = 0;
let zeroCount = 0;
let powerCount = 0;
let attendees = [];

function getTeamName(team) {
  if (team === "water") {
    return "Team Water Wise";
  }
  if (team === "zero") {
    return "Team Net Zero";
  }
  if (team === "power") {
    return "Team Renewables";
  }
  return "";
}

function saveProgress() {
  const savedData = {
    attendeeCount: attendeeCount,
    waterCount: waterCount,
    zeroCount: zeroCount,
    powerCount: powerCount,
    attendees: attendees,
  };
  localStorage.setItem(storageKey, JSON.stringify(savedData));
}

function loadProgress() {
  const savedData = localStorage.getItem(storageKey);
  if (savedData === null) {
    return;
  }

  try {
    const savedProgress = JSON.parse(savedData);
    attendeeCount = savedProgress.attendeeCount || 0;
    waterCount = savedProgress.waterCount || 0;
    zeroCount = savedProgress.zeroCount || 0;
    powerCount = savedProgress.powerCount || 0;
    attendees = savedProgress.attendees || [];
  } catch (error) {
    localStorage.removeItem(storageKey);
  }
}

function showAttendees() {
  attendeeList.textContent = "";

  for (let i = 0; i < attendees.length; i += 1) {
    const attendee = attendees[i];
    const attendeeItem = document.createElement("li");
    const name = document.createElement("span");
    const team = document.createElement("span");

    name.textContent = attendee.name;
    team.textContent = getTeamName(attendee.team);
    team.className = "attendee-team";
    attendeeItem.appendChild(name);
    attendeeItem.appendChild(team);
    attendeeList.appendChild(attendeeItem);
  }

  emptyAttendees.style.display = attendees.length === 0 ? "block" : "none";
}

function showCelebration() {
  const highestTeamCount = Math.max(waterCount, zeroCount, powerCount);
  const winningTeams = [];

  if (waterCount === highestTeamCount) {
    winningTeams.push("Team Water Wise");
  }
  if (zeroCount === highestTeamCount) {
    winningTeams.push("Team Net Zero");
  }
  if (powerCount === highestTeamCount) {
    winningTeams.push("Team Renewables");
  }

  celebration.textContent = `Summit goal reached! ${winningTeams.join(" and ")} ${winningTeams.length === 1 ? "is" : "are"} leading the turnout.`;
  celebration.hidden = false;
}

function updateDisplays() {
  attendeeCountDisplay.textContent = attendeeCount;
  document.getElementById("waterCount").textContent = waterCount;
  document.getElementById("zeroCount").textContent = zeroCount;
  document.getElementById("powerCount").textContent = powerCount;

  const progressPercentage = Math.min(
    (attendeeCount / maxAttendees) * 100,
    100,
  );
  progressBar.style.width = `${progressPercentage}%`;
  showAttendees();

  if (attendeeCount >= maxAttendees) {
    showCelebration();
  }
}

loadProgress();
updateDisplays();

checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const attendeeName = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;

  if (attendeeName === "") {
    return;
  }

  if (selectedTeam === "water") {
    waterCount = waterCount + 1;
  } else if (selectedTeam === "zero") {
    zeroCount = zeroCount + 1;
  } else if (selectedTeam === "power") {
    powerCount = powerCount + 1;
  } else {
    return;
  }

  attendeeCount = attendeeCount + 1;
  attendees.push({ name: attendeeName, team: selectedTeam });
  saveProgress();
  updateDisplays();

  greeting.textContent = `Welcome, ${attendeeName}! You are checked in with ${getTeamName(selectedTeam)}.`;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

  checkInForm.reset();
});
