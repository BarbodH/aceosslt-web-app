import { passages } from "../Resources/question-bank.js";

const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const questionContainerElement = document.getElementById("question-container");
const passageElement = document.getElementById("passage");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const resultContainerElement = document.getElementById("result-container");
const resultElement = document.getElementById("result");

let shuffledPassages, shuffledQuestions, currentQuestionIndex, score;
let correctAnswers = 0,
  totalAnswers = 0;

startButton.addEventListener("click", startQuiz);
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});

function startQuiz() {
  startButton.classList.add("hide");
  shuffledPassages = shuffleArray(passages); // shuffle passages in the passages
  for (let i = 0; i < passages.length; i++) {
    shuffledQuestions = shuffleArray(passages[i].questions); // shuffle questions of each passage
    currentQuestionIndex = 0;
    showPassage(passages[i]);
    questionContainerElement.classList.remove("hide");
  }
}

function showPassage(currentPassage) {
  passageElement.innerText = currentPassage.passageText;
  const button = document.createElement("button");
  button.innerText = "Proceed to Questions";
  button.classList.add("btn");
  button.addEventListener("click", () => {
    passageElement.classList.add("hide");
    setNextQuestion();
  });
  answerButtonsElement.appendChild(button);
}

function showResult(score) {
  questionContainerElement.classList.add("hide");
  resultElement.innerText = score + "%";
  resultContainerElement.classList.remove("hide");
}

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(currentQuestion) {
  questionElement.innerText = currentQuestion.question;
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

function resetState() {
  clearStatusClass(document.body); // document.body
  nextButton.classList.add("hide");
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

function selectAnswer(e) {
  const selectedButton = e.target; // target
  const correct = selectedButton.dataset.correct;
  updateScore(correct);
  setStatusClass(document.body, correct);
  Array.from(answerButtonsElement.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct);
  });
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
  } else {
    // display final result
    score = (correctAnswers / totalAnswers) * 100;
    showResult(score);
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}

function updateScore(correct) {
  totalAnswers++;
  if (correct) {
    correctAnswers++;
  }
}

// Fisher-Yates algorithm - shuffle a given array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};
