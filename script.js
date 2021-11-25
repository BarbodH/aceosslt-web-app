const startButton = document.getElementById('start-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');

let shuffledQuestions, currentQuestionIndex;

startButton.addEventListener("click", startGame);

function startGame() {
    console.log('Started');
    startButton.classList.add('hide'); // classList
    shuffledQuestions = questions.sort(() => Math.random() - 0.5); // shuffles questions
    currentQuestionIndex = 0;
    questionContainerElement.classList.remove('hide');
    setNextQuestion();
}

function setNextQuestion() {
    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionElement.innerText = question.question // innerText?
    question.answers.forEach(answer => { // ?
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct // dataset
        }
    })
    button.addEventListener('click', selectAnswer);
    answerButtonsElement.appendChild(button); // appendChild
}

function selectAnswer() {

}

const questions = [
    {
        question: 'What is 2 + 2?',
        answers: [
            { text: '4', correct: true},
            { text: '22', correct: false}
        ]
    }
]