const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const playAudioButton = document.getElementById('play-audio-btn');
const imageAnswerButtonsElement = document.getElementById('image-answer-buttons');

let shuffledQuestions, currentQuestionIndex;

let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;

// Check if speech synthesis is supported
if (!speechSynthesis) {
    console.warn('Speech synthesis not supported in this browser');
    // Hide the play audio button if speech synthesis is not supported
    document.addEventListener('DOMContentLoaded', () => {
        const playAudioBtn = document.getElementById('play-audio-btn');
        if (playAudioBtn) {
            playAudioBtn.style.display = 'none';
        }
    });
}

const questions = [
    {
        audioQuestion: 'Which one is the letter A?',
        answers: [
            { image: 'alphabet_a.svg', correct: true },
            { image: 'alphabet_b.svg', correct: false },
            { image: 'alphabet_c.svg', correct: false },
            { image: 'alphabet_d.svg', correct: false }
        ]
    },
    {
        audioQuestion: 'Which one is an apple?',
        answers: [
            { image: 'apple.svg', correct: true },
            { image: 'banana.svg', correct: false },
            { image: 'carrot.svg', correct: false },
            { image: 'broccoli.svg', correct: false }
        ]
    },
    {
        audioQuestion: 'Which color is blue?',
        answers: [
            { image: 'color_green.svg', correct: false },
            { image: 'color_red.svg', correct: false },
            { image: 'color_blue.svg', correct: true },
            { image: 'color_yellow.svg', correct: false }
        ]
    },
    {
        audioQuestion: 'Which one is a banana?',
        answers: [
            { image: 'banana.svg', correct: true },
            { image: 'grape.svg', correct: false },
            { image: 'orange.svg', correct: false },
            { image: 'strawberry.svg', correct: false }
        ]
    },
    {
        audioQuestion: 'Which color is red?',
        answers: [
            { image: 'color_blue.svg', correct: false },
            { image: 'color_green.svg', correct: false },
            { image: 'color_red.svg', correct: true },
            { image: 'color_yellow.svg', correct: false }
        ]
    },
    {
        audioQuestion: 'Which one is the letter D?',
        answers: [
            { image: 'alphabet_a.svg', correct: false },
            { image: 'alphabet_b.svg', correct: false },
            { image: 'alphabet_c.svg', correct: false },
            { image: 'alphabet_d.svg', correct: true }
        ]
    },
    {
        audioQuestion: 'Which one is purple?',
        answers: [
            { image: 'color_green.svg', correct: false },
            { image: 'color_red.svg', correct: false },
            { image: 'color_blue.svg', correct: false },
            { image: 'color_purple.svg', correct: true }
        ]
    },
    {
        audioQuestion: 'Which one is a cherry?',
        answers: [
            { image: 'cherry.svg', correct: true },
            { image: 'lime.svg', correct: false },
            { image: 'lemon.svg', correct: false },
            { image: 'pear.svg', correct: false }
        ]
    },
    {
        audioQuestion: 'Which color is green?',
        answers: [
            { image: 'color_green.svg', correct: true },
            { image: 'color_orange.svg', correct: false },
            { image: 'color_pink.svg', correct: false },
            { image: 'color_brown.svg', correct: false }
        ]
    },
    {
        audioQuestion: 'Which one is the letter Y?',
        answers: [
            { image: 'alphabet_x.svg', correct: false },
            { image: 'alphabet_y.svg', correct: true },
            { image: 'alphabet_w.svg', correct: false },
            { image: 'alphabet_v.svg', correct: false }
        ]
    }
];

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});
playAudioButton.addEventListener('click', () => {
    speakQuestion(shuffledQuestions[currentQuestionIndex].audioQuestion);
});

function startGame() {
    startButton.classList.add('hide');
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    questionContainerElement.classList.remove('hide');
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
    // Remove the problematic Google TTS code
    // questionAudioElement.src = `http://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(question.audioQuestion)}&tl=en`;
    // questionAudioElement.play();

    // Instead, speak the question immediately
    speakQuestion(question.audioQuestion);

    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.classList.add('btn');
        const img = document.createElement('img');
        img.src = answer.image;
        button.appendChild(img);

        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        imageAnswerButtonsElement.appendChild(button);
    });
}

function speakQuestion(text) {
    // Check if speech synthesis is supported
    if (!speechSynthesis) {
        console.warn('Speech synthesis not supported');
        return;
    }
    
    try {
        // Stop any currently playing speech
        if (currentUtterance) {
            speechSynthesis.cancel();
        }
        
        // Create new utterance
        currentUtterance = new SpeechSynthesisUtterance(text);
        currentUtterance.lang = 'en-US';
        currentUtterance.rate = 0.8;
        currentUtterance.pitch = 1;
        
        // Add event listeners for better user experience
        currentUtterance.onstart = () => {
            console.log('Started speaking:', text);
        };
        
        currentUtterance.onend = () => {
            console.log('Finished speaking:', text);
        };
        
        currentUtterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
        };
        
        // Speak the text
        speechSynthesis.speak(currentUtterance);
    } catch (error) {
        console.error('Error with speech synthesis:', error);
    }
}

function resetState() {
    clearStatusClass(document.body);
    nextButton.classList.add('hide');
    while (imageAnswerButtonsElement.firstChild) {
        imageAnswerButtonsElement.removeChild(imageAnswerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target.closest('.btn');
    const correct = selectedButton.dataset.correct;
    setStatusClass(document.body, correct);
    Array.from(imageAnswerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct);
    });
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        startButton.innerText = 'Restart';
        startButton.classList.remove('hide');
    }
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}