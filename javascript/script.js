const configContainer = document.querySelector(".config-container");
const quizContainer = document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".time-duration");
const resultConatiner = document.querySelector(".result-container");

//Quiz state variable
const QUIZ_TIME_LIMIT = 15;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
let quizCategory = "programming";
let numberOfQuestions = 10;
let currentQuestion = null;
const questionIndexHistory = [];
let correctAnswerCount = 0;

const showQuizResult = () => {
  quizContainer.style.display = "none";
  resultConatiner.style.display = "block";

  const resultText = `You answered <b>${correctAnswerCount}</b> out of <b>${numberOfQuestions}</b> questions correctly. Great effort!`;
  document.querySelector(".result-message").innerHTML = resultText;
};

const resetTimer = () => {
  clearInterval(timer);
  currentTime = QUIZ_TIME_LIMIT;
  timerDisplay.textContent = `${currentTime}s`;
};

//Initialize and start the timer for the current question
const startTimer = () => {
  timer = setInterval(() => {
    currentTime--;
    timerDisplay.textContent = `${currentTime}s`;

    if (currentTime <= 0) {
      clearInterval(timer);
      highlightCorrectAnswer();
      nextQuestionBtn.style.visibility = "visible";
      quizContainer.querySelector(".quiz-timer").style.background = "#c31402";

      //disable all answer options after one option is selected
      answerOptions
        .querySelectorAll(".answer-option")
        .forEach((option) => (option.style.pointerEvents = "none"));
    }
  }, 1000);
};

//Fetch a random question from based on the selected category
const getRandomQuestion = () => {
  const categoryQuestions =
    questions.find(
      (cat) => cat.category.toLowerCase() === quizCategory.toLowerCase()
    ).questions || [];

  //Show the results if all questions have been used
  if (
    questionIndexHistory.length >=
    Math.min(categoryQuestions.length, numberOfQuestions)
  ) {
    return showQuizResult();
  }

  //Filter out already asked questions and choode a random one
  const availableQuestion = categoryQuestions.filter(
    (_, index) => !questionIndexHistory.includes(index)
  );

  const randomQuestion =
    availableQuestion[Math.floor(Math.random() * availableQuestion.length)];

  questionIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
  return randomQuestion;
};

//Highlight the correct answer option and add icon
const highlightCorrectAnswer = () => {
  const correctOption =
    answerOptions.querySelectorAll(".answer-option")[
      currentQuestion.correctAnswer
    ];
  correctOption.classList.add("correct");
  const iconHTML = `<span class="material-symbols-rounded">check_circle</span>`;
  correctOption.insertAdjacentHTML("beforeend", iconHTML);
};

//Handle the user's answer selection
const handleAnswer = (option, answerIndex) => {
  clearInterval(timer);
  const isCorrect = currentQuestion.correctAnswer === answerIndex;
  option.classList.add(isCorrect ? "correct" : "incorrect");
  !isCorrect ? highlightCorrectAnswer() : correctAnswerCount++;

  //Insert icon based on correctness
  const iconHTML = `<span class="material-symbols-rounded">${
    isCorrect ? "check_circle" : "cancel"
  }</span>`;
  option.insertAdjacentHTML("beforeend", iconHTML);

  //disable all answer options after one option is selected
  answerOptions
    .querySelectorAll(".answer-option")
    .forEach((option) => (option.style.pointerEvents = "none"));
  nextQuestionBtn.style.visibility = "visible";
};

//render the current question and its options in the quiz
const renderQuestion = () => {
  currentQuestion = getRandomQuestion();
  if (!currentQuestion) return;

  resetTimer();
  startTimer();

  //Update the UI
  answerOptions.innerHTML = "";
  nextQuestionBtn.style.visibility = "hidden";
  quizContainer.querySelector(".quiz-timer").style.background = "#32313c";
  document.querySelector(".question-text").textContent =
    currentQuestion.question;
  questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`;

  //Create option li elements, append them and add click event listeners
  currentQuestion.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.classList.add("answer-option");
    li.textContent = option;
    answerOptions.appendChild(li);
    li.addEventListener("click", () => handleAnswer(li, index));
  });
};

//start the qiuz and render the random question
const statQuiz = () => {
  configContainer.style.display = "none";
  quizContainer.style.display = "block";

  //Update the quiz category and number of questions
  quizCategory = configContainer.querySelector(
    ".category-option.active"
  ).textContent;
  numberOfQuestions = parseInt(
    configContainer.querySelector(".question-option.active").textContent
  );

  renderQuestion();
};

//Highlight the selected option on click - category or no. of question
document
  .querySelectorAll(".category-option, .question-option")
  .forEach((option) =>
    option.addEventListener("click", () => {
      option.parentNode.querySelector(".active").classList.remove("active");
      option.classList.add("active");
    })
  );

//Reset the quiz and return to the configuration container
const resetQuiz = () => {
  resetTimer();
  correctAnswerCount = 0;
  questionIndexHistory.length = 0;
  configContainer.style.display = "block";
  resultConatiner.style.display = "none";
};

nextQuestionBtn.addEventListener("click", renderQuestion);
document.querySelector(".try-aging-btn").addEventListener("click", resetQuiz);
document.querySelector(".start-quiz-btn").addEventListener("click", statQuiz);
