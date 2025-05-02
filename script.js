// Quiz question in array
const quizQuestions = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: 2
    },
    {
        question: "Which of these is a CSS framework?",
        options: ["React", "Laravel", "Django", "Bootstrap"],
        correctAnswer: 3
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
        correctAnswer: 1
    },
    {
        question: "Which language runs in a web browser?",
        options: ["Java", "C", "Python", "JavaScript"],
        correctAnswer: 3
    },
    {
        question: "What does HTML stand for?",
        options: [
            "Hypertext Markup Language",
            "Hypertext Markdown Language",
            "Hyperloop Machine Language",
            "Helicopters Terminals Motorboats Lamborginis"
        ],
        correctAnswer: 0
    }
];

// DOM elements
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');
const scoreContainer = document.getElementById('score-container');
const scoreElement = document.getElementById('score');
const maxScoreElement = document.getElementById('max-score');
const restartBtn = document.getElementById('restart-btn');
const timerElement = document.createElement('div'); // New timer element

// Quiz state variables
let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = null;
let userAnswers = [];
let timer;
let timeLeft;

// Initialize the quiz
function initQuiz() {
    totalQuestionsElement.textContent = quizQuestions.length;
    timerElement.id = 'timer';
    document.querySelector('.quiz-header').prepend(timerElement); // Add timer to header
    showQuestion();
}

// Display current question
function showQuestion() {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';
    
    currentQuestionElement.textContent = currentQuestionIndex + 1;
    selectedOptionIndex = null;
    nextBtn.disabled = true;

    // Start timer (10 seconds per question)
    timeLeft = 60;
    updateTimerDisplay();
    startTimer();

    currentQuestion.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.classList.add('option');
        optionButton.textContent = option;
        optionButton.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionButton);
    });
}

// Timer functions
function startTimer() {
    clearInterval(timer); // Clear any existing timer
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            autoSkipQuestion();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerElement.textContent = `⏱️ ${timeLeft}s`;
    timerElement.style.color = timeLeft <= 3 ? 'red' : 'black'; // Red when time is critical
}

function autoSkipQuestion() {
    // Mark as unanswered if no selection was made
    if (selectedOptionIndex === null) {
        userAnswers.push({
            questionIndex: currentQuestionIndex,
            selectedOption: null,
            correctAnswer: quizQuestions[currentQuestionIndex].correctAnswer
        });
    }
    proceedToNextQuestion();
}



// Handle option selection
function selectOption(index) {
    clearInterval(timer); // Stop timer when an answer is selected
    
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    
    options[index].classList.add('selected');
    selectedOptionIndex = index;
    nextBtn.disabled = false;
}

// Move to next question or show score
function nextQuestion() {
    clearInterval(timer); // Stop timer when moving manually
    proceedToNextQuestion();
}

function proceedToNextQuestion() {
    // Check if answer is correct (only if an option was selected)
    if (selectedOptionIndex !== null && 
        selectedOptionIndex === quizQuestions[currentQuestionIndex].correctAnswer) {
        score++;
    }
    
    // Store user answer (even if unanswered)
    if (selectedOptionIndex !== null) {
        userAnswers.push({
            questionIndex: currentQuestionIndex,
            selectedOption: selectedOptionIndex,
            correctAnswer: quizQuestions[currentQuestionIndex].correctAnswer
        });
    }
    
    // Move to next question or end quiz
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        showQuestion();
    } else {
        if (score === quizQuestions.length) {
            score = quizQuestions.length; // Perfect score
        }
        showScore();
    }
}

// Display final score
function showScore() {
    clearInterval(timer);
    document.querySelector('.quiz-header').style.display = 'none';
    optionsContainer.style.display = 'none';
    nextBtn.style.display = 'none';
    scoreContainer.style.display = 'block';
    scoreElement.textContent = score;
    maxScoreElement.textContent = quizQuestions.length;
}

// Restart quiz
function restartQuiz() {
    clearInterval(timer);
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    selectedOptionIndex = null;
    
    document.querySelector('.quiz-header').style.display = 'block';
    optionsContainer.style.display = 'flex';
    nextBtn.style.display = 'block';
    scoreContainer.style.display = 'none';
    
    showQuestion();
}


// Event listeners
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);

// Start the quiz
initQuiz();