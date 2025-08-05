const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const errorsDisplay = document.getElementById('errors');
const completeBtn = document.getElementById('complete');
const resetBtn = document.getElementById('reset');
const resultContainer = document.getElementById('result');
const finalAccuracyDisplay = document.getElementById('final-accuracy');
const suggestionDisplay = document.getElementById('suggestion');

let passage = `The difference between who you are and who you want to be is what you do repeatedly; greatness is hidden in your daily routine, not occasional brilliance.`;
let timer;
let timeLimit = 60;
let timeLeft = timeLimit;
let isTyping = false;
let correctChars = 0;
let totalErrors = 0;

function loadText() {
  textDisplay.innerHTML = '';
  passage.split('').forEach(char => {
    const span = document.createElement('span');
    span.innerText = char;
    textDisplay.appendChild(span);
  });
}

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timerDisplay.innerText = `${timeLeft}s`;
    } else {
      clearInterval(timer);
      endTest();
    }
  }, 1000);
}

function updateStats() {
  const input = textInput.value;
  const spans = textDisplay.querySelectorAll('span');

  correctChars = 0;
  totalErrors = 0;

  for (let i = 0; i < spans.length; i++) {
    const typedChar = input[i];

    if (typedChar == null) {
      spans[i].classList.remove('correct', 'incorrect');
    } else if (typedChar === spans[i].innerText) {
      spans[i].classList.add('correct');
      spans[i].classList.remove('incorrect');
      correctChars++;
    } else {
      spans[i].classList.add('incorrect');
      spans[i].classList.remove('correct');
      totalErrors++;
    }
  }

  const timeSpent = (timeLimit - timeLeft) / 60;
  const totalTyped = input.length;
  const wpm = timeSpent > 0 ? Math.round((correctChars / 5) / timeSpent) : 0;
  const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;

  wpmDisplay.innerText = wpm;
  accuracyDisplay.innerText = `${accuracy}%`;
  errorsDisplay.innerText = totalErrors;

  return { wpm, accuracy };
}



function endTest() {
  textInput.disabled = true;
  const stats = updateStats();
  finalAccuracyDisplay.innerText = `${stats.accuracy}%`;
  suggestionDisplay.innerText = generateSuggestion(stats);  // <-- fixed here
  resultContainer.style.display = 'block';
}

function generateSuggestion({ wpm, accuracy }) {
  const timeUsed = timeLimit - timeLeft;
  const timeUsedSec = timeUsed;
  const timeUsedFormatted = timeUsedSec < 60
    ? `${timeUsedSec} second${timeUsedSec === 1 ? '' : 's'}`
    : `${Math.floor(timeUsedSec / 60)} minute`;

  let wpmFeedback = '';
  let accuracyFeedback = '';
  let timingFeedback = '';

  
  if (wpm >= 70) {
    wpmFeedback = "🚀 Your typing speed is excellent.";
  } else if (wpm >= 50) {
    wpmFeedback = "✅ Your typing speed is good.";
  } else if (wpm >= 30) {
    wpmFeedback = "⚠️ Your speed is average, aim higher.";
  } else {
    wpmFeedback = "🐢 You need to work on your speed.";
  }


  if (accuracy >= 95) {
    accuracyFeedback = "🎯 Outstanding accuracy.";
  } else if (accuracy >= 85) {
    accuracyFeedback = "👌 Accuracy is decent, but watch those errors.";
  } else {
    accuracyFeedback = "❌ Too many mistakes. Focus on precision.";
  }

  if (timeLeft === 0) {
    timingFeedback = "⏳ You used the full time.";
  } else if (timeLeft >= 10) {
    timingFeedback = "🕒 You finished early. Great confidence!";
  } else {
    timingFeedback = "⌛ Nearly ran out of time.";
  }

 
  return `${wpmFeedback} ${accuracyFeedback} ${timingFeedback} You typed at ${wpm} WPM with ${accuracy}% accuracy in ${timeUsedFormatted}.`;
}


textInput.addEventListener('input', () => {
  if (!isTyping) {
    isTyping = true;
    startTimer();
  }
  updateStats();
});

completeBtn.addEventListener('click', () => {
  clearInterval(timer);
  endTest();
});

resetBtn.addEventListener('click', () => {
  clearInterval(timer);
  isTyping = false;
  timeLeft = timeLimit;
  textInput.value = '';
  textInput.disabled = false;
  timerDisplay.innerText = `${timeLimit}s`;
  wpmDisplay.innerText = '0';
  accuracyDisplay.innerText = '0%';
  errorsDisplay.innerText = '0';
  resultContainer.style.display = 'none';
  loadText();
});

window.onload = loadText;
