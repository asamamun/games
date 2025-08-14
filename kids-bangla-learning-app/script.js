const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const playAudioButton = document.getElementById('play-audio-btn');
const debugVoicesButton = document.getElementById('debug-voices-btn');
const voiceSelectElement = document.getElementById('voice-select');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');

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
} else {
    // Populate voice dropdown when voices are available
    speechSynthesis.onvoiceschanged = populateVoiceDropdown;
}

const questions = [
    {
        type: 'alphabet',
        audioQuestion: 'কোনটি অ অক্ষর?',
        question: 'কোনটি অ অক্ষর?',
        answers: [
            { text: 'অ', correct: true },
            { text: 'আ', correct: false },
            { text: 'ই', correct: false },
            { text: 'ঈ', correct: false }
        ]
    },
    {
        type: 'color',
        audioQuestion: 'কোনটি লাল রঙ?',
        question: 'কোনটি লাল রঙ?',
        answers: [
            { color: 'green', correct: false },
            { color: 'red', correct: true },
            { color: 'blue', correct: false },
            { color: 'yellow', correct: false }
        ]
    },
    {
        type: 'number',
        audioQuestion: 'কোনটি সংখ্যা পাঁচ?',
        question: 'কোনটি সংখ্যা পাঁচ?',
        answers: [
            { text: '১', correct: false },
            { text: '২', correct: false },
            { text: '৫', correct: true },
            { text: '১০', correct: false }
        ]
    },
    {
        type: 'alphabet',
        audioQuestion: 'কোনটি ক অক্ষর?',
        question: 'কোনটি ক অক্ষর?',
        answers: [
            { text: 'খ', correct: false },
            { text: 'গ', correct: false },
            { text: 'ক', correct: true },
            { text: 'ঘ', correct: false }
        ]
    },
    {
        type: 'color',
        audioQuestion: 'কোনটি সবুজ রঙ?',
        question: 'কোনটি সবুজ রঙ?',
        answers: [
            { color: 'red', correct: false },
            { color: 'blue', correct: false },
            { color: 'green', correct: true },
            { color: 'black', correct: false }
        ]
    },
    {
        type: 'number',
        audioQuestion: 'কোনটি সংখ্যা আট?',
        question: 'কোনটি সংখ্যা আট?',
        answers: [
            { text: '৭', correct: false },
            { text: '৮', correct: true },
            { text: '৯', correct: false },
            { text: '৬', correct: false }
        ]
    },
    {
        type: 'alphabet',
        audioQuestion: 'কোনটি চ অক্ষর?',
        question: 'কোনটি চ অক্ষর?',
        answers: [
            { text: 'ছ', correct: false },
            { text: 'জ', correct: false },
            { text: 'চ', correct: true },
            { text: 'ঝ', correct: false }
        ]
    },
    {
        type: 'color',
        audioQuestion: 'কোনটি হলুদ রঙ?',
        question: 'কোনটি হলুদ রঙ?',
        answers: [
            { color: 'purple', correct: false },
            { color: 'orange', correct: false },
            { color: 'yellow', correct: true },
            { color: 'pink', correct: false }
        ]
    },
    {
        type: 'number',
        audioQuestion: 'কোনটি সংখ্যা তিন?',
        question: 'কোনটি সংখ্যা তিন?',
        answers: [
            { text: '১', correct: false },
            { text: '২', correct: false },
            { text: '৩', correct: true },
            { text: '৪', correct: false }
        ]
    },
    {
        type: 'alphabet',
        audioQuestion: 'কোনটি ট অক্ষর?',
        question: 'কোনটি ট অক্ষর?',
        answers: [
            { text: 'ঠ', correct: false },
            { text: 'ড', correct: false },
            { text: 'ট', correct: true },
            { text: 'ঢ', correct: false }
        ]
    },
    {
        type: 'color',
        audioQuestion: 'কোনটি নীল রঙ?',
        question: 'কোনটি নীল রঙ?',
        answers: [
            { color: 'green', correct: false },
            { color: 'red', correct: false },
            { color: 'blue', correct: true },
            { color: 'yellow', correct: false }
        ]
    },
    {
        type: 'number',
        audioQuestion: 'কোনটি সংখ্যা নয়?',
        question: 'কোনটি সংখ্যা নয়?',
        answers: [
            { text: '৭', correct: false },
            { text: '৮', correct: false },
            { text: '৯', correct: true },
            { text: '১০', correct: false }
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

debugVoicesButton.addEventListener('click', () => {
    showAvailableVoices();
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
    questionElement.innerText = question.question;
    // Remove the problematic Google TTS code
    // questionAudioElement.src = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(question.audioQuestion)}&tl=bn`;
    // questionAudioElement.play();

    // Instead, speak the question immediately
    speakQuestion(question.audioQuestion);

    answerButtonsElement.innerHTML = ''; // Clear previous answers

    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.classList.add('btn');

        if (question.type === 'color') {
            button.style.backgroundColor = answer.color;
            button.style.width = '100px';
            button.style.height = '100px';
            button.innerText = ''; // No text for color buttons
        } else {
            button.innerText = answer.text;
        }
        
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    clearStatusClass(document.body);
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    setStatusClass(document.body, correct);
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct);
    });
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        startButton.innerText = 'পুনরায় শুরু করুন';
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
        
        // Try to find a Bengali voice, fallback to English if needed
        let voices = speechSynthesis.getVoices();
        
        // If voices aren't loaded yet, wait for them
        if (voices.length === 0) {
            speechSynthesis.onvoiceschanged = () => {
                voices = speechSynthesis.getVoices();
                setVoiceAndSpeak();
            };
        } else {
            setVoiceAndSpeak();
        }
        
        function setVoiceAndSpeak() {
            // Check if user has manually selected a voice
            const selectedVoiceName = voiceSelectElement.value;
            let selectedVoice = null;
            
            if (selectedVoiceName) {
                selectedVoice = voices.find(voice => voice.name === selectedVoiceName);
                if (selectedVoice) {
                    currentUtterance.voice = selectedVoice;
                    currentUtterance.lang = selectedVoice.lang;
                    console.log('Using manually selected voice:', selectedVoice.name);
                }
            }
            
            // If no manual selection, use automatic voice selection
            if (!selectedVoice) {
                // Try to find the best Bengali voice
                let bengaliVoice = voices.find(voice => 
                    voice.lang.startsWith('bn') || 
                    voice.name.toLowerCase().includes('bengali') ||
                    voice.name.toLowerCase().includes('bangla')
                );
                
                // If no Bengali voice, try Hindi with better filtering
                let hindiVoice = voices.find(voice => 
                    voice.lang.startsWith('hi') && 
                    (voice.name.toLowerCase().includes('hindi') || 
                     voice.name.toLowerCase().includes('india'))
                );
                
                // Fallback to English voice if no Bengali/Hindi found
                let englishVoice = voices.find(voice => 
                    voice.lang.startsWith('en')
                );
                
                // Use the best available voice
                if (bengaliVoice) {
                    currentUtterance.voice = bengaliVoice;
                    currentUtterance.lang = bengaliVoice.lang;
                    console.log('Using Bengali voice:', bengaliVoice.name);
                } else if (hindiVoice) {
                    currentUtterance.voice = hindiVoice;
                    currentUtterance.lang = hindiVoice.lang;
                    console.log('Using Hindi voice (Bengali fallback):', hindiVoice.name);
                } else if (englishVoice) {
                    currentUtterance.voice = englishVoice;
                    currentUtterance.lang = englishVoice.lang;
                    console.log('Using English voice as fallback:', englishVoice.name);
                }
            }
            
            // Adjust speech parameters for better Bengali pronunciation
            currentUtterance.rate = 0.7; // Slower for better clarity
            currentUtterance.pitch = 1.1; // Slightly higher pitch for Bengali
            currentUtterance.volume = 1.0; // Full volume
            
            // Add event listeners for better user experience
            currentUtterance.onstart = () => {
                console.log('Started speaking:', text);
                console.log('Voice:', currentUtterance.voice?.name, 'Language:', currentUtterance.lang);
            };
            
            currentUtterance.onend = () => {
                console.log('Finished speaking:', text);
            };
            
            currentUtterance.onerror = (event) => {
                console.error('Speech synthesis error:', event.error);
                // If Bengali/Hindi fails, try English as last resort
                if ((currentUtterance.lang.startsWith('bn') || currentUtterance.lang.startsWith('hi')) && englishVoice) {
                    console.log('Trying English fallback...');
                    currentUtterance.lang = englishVoice.lang;
                    currentUtterance.voice = englishVoice;
                    currentUtterance.rate = 0.8; // Normal rate for English
                    currentUtterance.pitch = 1.0; // Normal pitch for English
                    speechSynthesis.speak(currentUtterance);
                }
            };
            
            // Speak the text
            speechSynthesis.speak(currentUtterance);
        }
        
    } catch (error) {
        console.error('Error with speech synthesis:', error);
    }
}

function showAvailableVoices() {
    const voices = speechSynthesis.getVoices();
    console.log('Available Voices:');
    voices.forEach(voice => {
        console.log(`- ${voice.name} (${voice.lang})`);
    });
    
    // Also show Bengali and Hindi voices specifically
    const bengaliVoices = voices.filter(voice => 
        voice.lang.startsWith('bn') || 
        voice.lang.startsWith('hi')
    );
    
    if (bengaliVoices.length > 0) {
        console.log('Bengali/Hindi Voices Found:');
        bengaliVoices.forEach(voice => {
            console.log(`- ${voice.name} (${voice.lang})`);
        });
    } else {
        console.log('No Bengali or Hindi voices found. Will use English fallback.');
    }
}

function populateVoiceDropdown() {
    const voices = speechSynthesis.getVoices();
    voiceSelectElement.innerHTML = ''; // Clear previous options
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelectElement.appendChild(option);
    });
}