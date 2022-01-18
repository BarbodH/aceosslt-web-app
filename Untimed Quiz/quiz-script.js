import { passages } from "../Resources/question-bank.js";

const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const prevButton = document.getElementById("prev-btn");
const proceedButton = document.getElementById("proceed-btn");
const passageButton = document.getElementById("passage-btn")
const submitButton = document.getElementById("submit-btn");
const questionContainerElement = document.getElementById("question-container");
const introElement = document.getElementById("intro");
const passageElement = document.getElementById("passage");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const resultContainerElement = document.getElementById("result-container");
const resultElement = document.getElementById("result");
const CHART = document.getElementById("doughnutChart");

let shuffledPassages, shuffledQuestions, currentQuestionIndex, score, currentPassage;
let answers = [false, false, false, false, false]; // * need to set the length dynamically based on quiz length
let answersText = ["", "", "", "", ""] // * need to set the length dynamically based on quiz length

startButton.addEventListener("click", () => {
  introElement.classList.add("hide");
  startQuiz();
});

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});

prevButton.addEventListener("click", () => {
  currentQuestionIndex--;
  setNextQuestion();
});

proceedButton.addEventListener("click", () => {
  passageElement.classList.add("hide");
  questionElement.classList.remove("hide");
  answerButtonsElement.classList.remove("hide");
  nextButton.classList.remove("hide");
  setNextQuestion();
});

passageButton.addEventListener("click", () => {
  showPassage();
})

submitButton.addEventListener("click", () => {
  // display final result following submission
  calculateScore(answers);
  let pieChart = new Chart(CHART, {
    type: "doughnut",
    data: {
      datasets: [
        {
          label: "Points",
          backgroundColor: ['hsl(100, 100%, 50%)', 'grey'],
          data: [score, (100 - score)]
        }
      ]
    },
    options: {
      animation: {
        animateScale: true
      }
    }
  });
  showResult(score);
})

function startQuiz() {
  startButton.classList.add("hide");
  shuffledPassages = shuffleArray(passages); // shuffle passages in the passages
  for (let i = 0; i < passages.length; i++) {
    currentPassage = passages[i];
    shuffledQuestions = shuffleArray(currentPassage.questions); // shuffle questions of each passage
    currentQuestionIndex = 0;
    showPassage();
    questionContainerElement.classList.remove("hide");
  }
}

function showPassage() {
  questionElement.classList.add("hide");
  answerButtonsElement.classList.add("hide");
  passageElement.classList.remove("hide");
  passageElement.innerText = currentPassage.passageText;
  nextButton.classList.add("hide");
  passageButton.classList.add("hide");
  proceedButton.classList.remove("hide");
}

function showResult(score) {
  submitButton.classList.add("hide");
  prevButton.classList.add("hide");
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
    if (button.innerText == answersText[currentQuestionIndex]) {
      button.classList.add("selected");
    }
    button.addEventListener("click", selectAnswer);
    answerButtonsElement.appendChild(button);
  });
  if (currentQuestionIndex === shuffledQuestions.length - 1) {
    nextButton.classList.add("hide");
    submitButton.classList.remove("hide");
  } else if (currentQuestionIndex === 0) {
    prevButton.classList.add("hide");
    passageButton.classList.remove("hide");
  } else {
    passageButton.classList.add("hide");
    prevButton.classList.remove("hide");
  }
}

function resetState() {
  clearStatusClass(document.body); // document.body
  // nextButton.classList.add("hide"); // commented out to keep next button during quiz
  proceedButton.classList.add("hide");
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

function resetAnswers() {
  Array.from(answerButtonsElement.children).forEach((button) => {
    button.classList.remove("selected");
  });
}

function selectAnswer(e) {
  resetAnswers();
  const selectedButton = e.target; // gets the selected button
  selectedButton.classList.add("selected");
  const correct = selectedButton.dataset.correct;
  // store the correctness and value of the selected answer
  answers[currentQuestionIndex] = correct;
  answersText[currentQuestionIndex] = selectedButton.innerText;
  setStatusClass(document.body, correct); // changes background colour based on answer; helps with assessing functionality
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

function calculateScore(answers) {
  let correctAnswers = 0;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i]) {
      correctAnswers++;
    }
  }
  score = (correctAnswers / answers.length) * 100;
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
