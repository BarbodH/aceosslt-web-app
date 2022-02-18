import { passages } from "../questionbanks/question-bank.js";

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
const progressBarElement = document.getElementById("progress-bar");
const pbListElement = document.getElementById("pb-list");
const resultContainerElement = document.getElementById("result-container");
const resultElement = document.getElementById("result");
const CHART = document.getElementById("doughnutChart");

// declare global variables
let shuffledQuestions, currentQuestionIndex, score, currentPassage, answers, answersText;

// display the list of passages for the user to choose
passages.forEach((passage) => {
  const choosePassage  = document.createElement("button");
  choosePassage.classList.add("btn", "btn-intro");
  if (passage.title === "") {
    choosePassage.innerText = passage.date;
  } else {
    choosePassage.innerText = passage.date + " — " + passage.title;
  }
  introElement.appendChild(choosePassage);
  choosePassage.addEventListener("click", () => {
    currentPassage = passage;
    answers = Array(passage.questions.length).fill(false);
    answersText = Array(passage.questions.length).fill("");
    initializeProgressBarItems();
    startQuiz();
  })
});

function initializeProgressBarItems() {
  for (let i = 0; i < currentPassage.questions.length; i++) {
    const pbItem = document.createElement("li");
    pbItem.innerText = i + 1;
    pbItem.classList.add("pb-item", "question-nav");
    pbListElement.appendChild(pbItem);
  }
  // define functionality of each button in progress bar
  pbListElement.querySelectorAll("li").forEach(item => {
    // handle selection
    item.addEventListener("click", () => {
      if (item.innerText === "P") {
        showPassage();
      } else {
        currentQuestionIndex = parseInt(item.innerText) - 1;
        setNextQuestion();
      }
    })
  });
}



nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});

prevButton.addEventListener("click", () => {
  currentQuestionIndex--;
  setNextQuestion();
});

proceedButton.addEventListener("click", () => {
  setNextQuestion();
});

passageButton.addEventListener("click", () => {
  showPassage();
})

submitButton.addEventListener("click", () => {
  // display final result following submission
  calculateScore(answers);
  let donutChart = new Chart(CHART, {
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
  introElement.classList.add("hide");
  shuffledQuestions = shuffleArray(currentPassage.questions); // shuffle questions of selected passage
  currentQuestionIndex = 0;
  showPassage();
}

function showPassage() {
  if (passageElement.firstChild == null) {
    const title = document.createElement("h1");
    const text = document.createElement("p");
    title.innerText = currentPassage.title;
    text.innerHTML = currentPassage.passageText;
    passageElement.appendChild(title);
    passageElement.appendChild(text);
  }
  setDisplay("passage");
}

function showResult(score) {
  resultElement.innerText = score + "%";
  setDisplay("result")
}

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(currentQuestion) {
  questionElement.innerHTML = (currentQuestionIndex + 1) + ") " + currentQuestion.question;
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
  setDisplay("question");
}

function resetState() {
  while (answerButtonsElement.firstChild) { // first child?
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

// Fisher-Yates algorithm - shuffle the array of questions
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

function setDisplay(stage) {
  if (stage === "passage") {
    hideAll();
    questionContainerElement.classList.remove("hide");
    passageElement.classList.remove("hide");
    proceedButton.classList.remove("hide");
    updateProgressBar();
  } else if (stage === "question") {
    hideAll();
    questionContainerElement.classList.remove("hide");
    questionElement.classList.remove("hide");
    answerButtonsElement.classList.remove("hide");
    updateProgressBar();
    if (currentQuestionIndex === 0) { // first question
      passageButton.classList.remove("hide");
      nextButton.classList.remove("hide");
    } else if (currentQuestionIndex === shuffledQuestions.length - 1) { // last question
      prevButton.classList.remove("hide");
      submitButton.classList.remove("hide");
    } else { // middle questions
      prevButton.classList.remove("hide");
      nextButton.classList.remove("hide");
    }
  } else if (stage === "result") {
    hideAll();
    resultContainerElement.classList.remove("hide");
  }
}

// helper function for setDisplay
function hideAll() {
  // containers
  questionContainerElement.classList.add("hide");
  resultContainerElement.classList.add("hide");
  // sub-containers
  passageElement.classList.add("hide");
  questionElement.classList.add("hide");
  answerButtonsElement.classList.add("hide");
  // controls
  nextButton.classList.add("hide");
  prevButton.classList.add("hide");
  proceedButton.classList.add("hide");
  passageButton.classList.add("hide");
  submitButton.classList.add("hide");
}

function updateProgressBar() {
  pbListElement.querySelectorAll("li").forEach(item => {
    if (item.innerText === (currentQuestionIndex + 1).toString()) {
      item.classList.add("active-pb-item");
    } else if (item.innerText !== "P") {
      item.classList.remove("active-pb-item");
    }
  });
}
