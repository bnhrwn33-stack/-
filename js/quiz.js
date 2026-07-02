const quizCard = document.getElementById('quizCard');
const quizProgress = document.getElementById('quizProgress');

let currentQ = 0;
const scores = {};

function renderQuestion() {
  quizProgress.style.width = (currentQ / QUIZ_QUESTIONS.length * 100) + '%';
  const question = QUIZ_QUESTIONS[currentQ];
  quizCard.innerHTML = `
    <div class="quiz-q">${question.q}</div>
    <div class="quiz-options">
      ${question.options.map((o, i) => `<button class="quiz-opt" data-i="${i}">${o.t}</button>`).join('')}
    </div>
  `;
  quizCard.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const hero = question.options[Number(btn.dataset.i)].hero;
      scores[hero] = (scores[hero] || 0) + 1;
      currentQ++;
      if (currentQ < QUIZ_QUESTIONS.length) {
        renderQuestion();
      } else {
        renderResult();
      }
    });
  });
}

function renderResult() {
  quizProgress.style.width = '100%';
  let winner = Object.keys(scores)[0];
  Object.keys(scores).forEach(h => {
    if (scores[h] > scores[winner]) winner = h;
  });
  const hero = HEROES.find(h => h.n === winner) || HEROES[0];
  quizCard.innerHTML = `
    <div class="quiz-result">
      <div class="quiz-result-emoji">${hero.e}</div>
      <h2>${hero.n}</h2>
      <p class="qr-role">${hero.r}</p>
      <p class="qr-desc">${hero.d}</p>
      <button class="quiz-restart" id="quizRestart">לענות שוב</button>
    </div>
  `;
  document.getElementById('quizRestart').addEventListener('click', () => {
    currentQ = 0;
    Object.keys(scores).forEach(k => delete scores[k]);
    renderQuestion();
  });
}

renderQuestion();
