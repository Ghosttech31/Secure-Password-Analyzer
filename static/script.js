VANTA.FOG({
  el: "#vanta-bg",
  highlightColor: 0xb8e3e9,
  highlightColor: 0x93b1b5,
  midtoneColor: 0x4f7c82,
  lowlightColor: 0x0b2e33,
  baseColor: 0x0000,
  blurFactor: 0.7,
  speed: 2.0,
  zoom: 1.2,
});

function checkStrength() {
  const password = document.getElementById("password").value;
  const resultText = document.getElementById("result");
  const suggestionsList = document.getElementById("suggestions");
  const crackTimeElem = document.getElementById("crack-time");
  const bar = document.getElementById("strength-bar");

  if (password.length === 0) {
    resultText.innerText = "";
    suggestionsList.innerHTML = "";
    crackTimeElem.innerText = "";
    bar.style.width = "0%";
    bar.className = "progress-bar";
    return;
  }

  const result = zxcvbn(password);

  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const barColors = [
    "bg-danger",
    "bg-danger",
    "bg-warning",
    "bg-info",
    "bg-success",
  ];
  const widthMap = ["10%", "30%", "50%", "75%", "100%"];

  resultText.innerText = `Strength: ${strengthLabels[result.score]}`;

  bar.style.width = widthMap[result.score];
  bar.className = `progress-bar ${barColors[result.score]}`;

  suggestionsList.innerHTML = "";

  if (result.feedback.suggestions.length === 0 && result.feedback.warning) {
    const li = document.createElement("li");
    li.textContent = result.feedback.warning;
    suggestionsList.appendChild(li);
  } else {
    result.feedback.suggestions.forEach((s) => {
      const li = document.createElement("li");
      li.textContent = s;
      suggestionsList.appendChild(li);
    });
  }

  if (result.crack_times_display.offline_slow_hashing_1e4_per_second) {
    crackTimeElem.innerText = `Estimated crack time: ${result.crack_times_display.offline_slow_hashing_1e4_per_second}`;
  } else {
    crackTimeElem.innerText = "";
  }
}
function generatePassword() {
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  document.getElementById("password").value = password;

  // Automatically check strength for new password
  checkStrength();
}
async function copyPassword() {
  const password = document.getElementById("password").value;
  try {
    await navigator.clipboard.writeText(password);
    alert("Password copied to clipboard!");
  } catch (err) {
    alert("Failed to copy password: " + err);
  }
}
document
  .getElementById("generate-btn")
  .addEventListener("click", generatePassword);
document.getElementById("copy-btn").addEventListener("click", copyPassword);
document
  .getElementById("toggle-password")
  .addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    const icon = document.getElementById("toggle-icon");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });
