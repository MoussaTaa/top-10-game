document.addEventListener('DOMContentLoaded', function() {
    const quizItems = document.querySelectorAll('.quiz-item');
    const quizContainer = document.querySelector('.quiz-container');
    const homeContainer = document.querySelector('.quiz-list');
    
    // Sample quiz data
    const quizzes = {
        'Top 10 Immigrants in France': {
            answers: ['Algeria', 'Morocco', 'Portugal', 'Tunisia', 'Italy', 'Turkey', 'Spain', 'UK', 'Belgium', 'Germany'],
            topic: 'immigrants in France'
        },
        'Top 10 Most Populous Countries': {
            answers: ['China', 'India', 'USA', 'Indonesia', 'Pakistan', 'Brazil', 'Nigeria', 'Bangladesh', 'Russia', 'Mexico'],
            topic: 'most populous countries'
        },
        'Top 10 Most Visited Countries': {
            answers: ['France', 'Spain', 'USA', 'China', 'Italy', 'Turkey', 'Mexico', 'Thailand', 'Germany', 'UK'],
            topic: 'most visited countries'
        },
        'Top 10 Largest Countries by Area': {
            answers: ['Russia', 'Canada', 'China', 'USA', 'Brazil', 'Australia', 'India', 'Argentina', 'Kazakhstan', 'Algeria'],
            topic: 'largest countries by area'
        },
        'Top 10 Most Powerful Countries': {
            answers: ['USA', 'China', 'Russia', 'Germany', 'UK', 'France', 'Japan', 'Israel', 'Saudi Arabia', 'South Korea'],
            topic: 'most powerful countries'
        },
        'Top 10 Happiest Countries': {
            answers: ['Finland', 'Denmark', 'Switzerland', 'Iceland', 'Netherlands', 'Norway', 'Sweden', 'Luxembourg', 'New Zealand', 'Austria'],
            topic: 'happiest countries'
        },
        'Top 10 Safest Countries': {
            answers: ['Iceland', 'New Zealand', 'Ireland', 'Denmark', 'Austria', 'Portugal', 'Slovenia', 'Czech Republic', 'Singapore', 'Canada'],
            topic: 'safest countries'
        },
        'Top 10 Most Educated Countries': {
            answers: ['Canada', 'Japan', 'Israel', 'South Korea', 'UK', 'USA', 'Australia', 'Finland', 'Norway', 'Luxembourg'],
            topic: 'most educated countries'
        },
        'Top 10 Most Beautiful Countries': {
            answers: ['New Zealand', 'Italy', 'Switzerland', 'Canada', 'Norway', 'South Africa', 'Japan', 'Greece', 'Costa Rica', 'Iceland'],
            topic: 'most beautiful countries'
        },
        'Top 10 Fastest Growing Economies': {
            answers: ['Guyana', 'Macao', 'Fiji', 'Libya', 'Palau', 'Dominican Republic', 'Ethiopia', 'Bangladesh', 'Vietnam', 'India'],
            topic: 'fastest growing economies'
        },
        // New Quizzes
        'Top 10 Oldest Countries in the World': {
        answers: ['Egypt', 'Iran', 'Japan', 'China', 'India', 'Greece', 'Ethiopia', 'Portugal', 'San Marino', 'France'],
        topic: 'oldest countries in the world'
        },
        'Top 10 Smartest Countries in the World': {
            answers: ['Singapore', 'Hong Kong', 'South Korea', 'Japan', 'Taiwan', 'Finland', 'Netherlands', 'Canada', 'Switzerland', 'United Kingdom'],
            topic: 'smartest countries in the world'
        },
        'Top 10 Immigrant Groups in the USA': {
            answers: ['Mexico', 'India', 'China', 'Philippines', 'El Salvador', 'Vietnam', 'Cuba', 'Dominican Republic', 'Guatemala', 'Korea'],
            topic: 'immigrants in USA'
        },
        'Top 10 Immigrant Groups in Germany': {
            answers: ['Turkey', 'Poland', 'Syria', 'Romania', 'Italy', 'Croatia', 'Greece', 'Russia', 'Serbia', 'Bulgaria'],
            topic: 'immigrants in Germany'
        }

    };
    
    let currentQuiz = null;
    let timer = null;
    let timeLeft = 150; // 2 minutes 30 seconds
    let userAnswers = Array(10).fill('');
    let score = 0;

    // Update timer display
    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.querySelector('.timer').textContent = 
            `Time left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // Start quiz
    function startQuiz() {
        const urlParams = new URLSearchParams(window.location.search);
        const quizName = urlParams.get('quiz');
        
        if (!quizName || !quizzes[quizName]) {
            window.location.href = 'index.html';
            return;
        }
        
        currentQuiz = quizzes[quizName];
        document.querySelector('.quiz-title').textContent = quizName;
        document.querySelector('.topic').textContent = currentQuiz.topic;
        
        // Reset state
        timeLeft = 150;
        userAnswers = Array(10).fill('');
        score = 0;
        updateTimer();
        
        // Start timer
        timer = setInterval(() => {
            timeLeft--;
            updateTimer();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                endQuiz();
            }
        }, 1000);
        
        // Show quiz interface
        homeContainer.classList.add('hidden');
        quizContainer.classList.remove('hidden');
    }

    // End quiz and show results
    function endQuiz() {
        clearInterval(timer);
        
        // Disable input
        document.querySelector('.answer-input').disabled = true;
        document.querySelector('.submit-answer').disabled = true;
        
        const startTime = Date.now() - (150 - timeLeft) * 1000;
        const quizTime = Math.floor((150 - timeLeft) / 60) + 'm ' + (150 - timeLeft) % 60 + 's';
        
        currentQuiz.answers.forEach((answer, index) => {
            const row = index < 5 ? index : index - 5;
            const col = index < 5 ? 2 : 4;
            const cell = document.querySelector(`.answers-table tr:nth-child(${row + 1}) td:nth-child(${col})`);
            
            if (userAnswers[index]) {
                cell.textContent = userAnswers[index];
                cell.className = userAnswers[index].toLowerCase() === answer.toLowerCase() ? 
                    'answer correct' : 'answer incorrect';
            } else {
                cell.textContent = answer;
                cell.className = 'answer remaining';
            }
        });
        
        document.querySelector('.score').textContent = `Score: ${score}/10`;
        
        // Show win message if perfect score
        if (score === 10) {
            const winMessage = document.querySelector('.win-message');
            winMessage.textContent = `You won! Time: ${quizTime}`;
            winMessage.classList.remove('hidden');
        }
        
        // Update quiz score in localStorage
        updateQuizScore(currentQuiz, score);
    }

    // Function to handle answer submission
    function submitAnswer() {
        if (timeLeft <= 0) return;
        
        const input = document.querySelector('.answer-input');
        const feedback = document.querySelector('.feedback-message');
        const answer = input.value.trim();
        
        if (!answer) return;
        
        feedback.className = 'feedback-message';
        
        const index = currentQuiz.answers.findIndex(
            a => a.toLowerCase() === answer.toLowerCase()
        );
        
        if (index >= 0 && userAnswers[index] === '') {
            userAnswers[index] = answer;
            score++;
            
            const row = index < 5 ? index : index - 5;
            const col = index < 5 ? 2 : 4;
            const cell = document.querySelector(`.answers-table tr:nth-child(${row + 1}) td:nth-child(${col})`);
            
            cell.textContent = answer;
            cell.className = 'answer correct';
            
            feedback.textContent = `Correct! ${answer} is #${index + 1}`;
            feedback.className = 'feedback-message feedback-correct';
            
            // Check if all answers are correct
            if (score === 10) {
                endQuiz();
            }
        } else {
            feedback.textContent = 'Incorrect or already answered!';
            feedback.className = 'feedback-message feedback-incorrect';
        }
        
        input.value = '';
        input.focus();
    }
    
    // Track quiz scores in localStorage
    function updateQuizScore(quizName, score) {
        const scores = JSON.parse(localStorage.getItem('quizScores') || '{}');
        scores[quizName] = score;
        localStorage.setItem('quizScores', JSON.stringify(scores));
        displayQuizScores();
    }

    function displayQuizScores() {
        const scores = JSON.parse(localStorage.getItem('quizScores') || '{}');
        
        Object.entries(scores).forEach(([quizName, score]) => {
            const scoreElement = document.querySelector(`.quiz-score[data-quiz="${quizName}"]`);
            if (scoreElement) {
                scoreElement.classList.remove('hidden');
                scoreElement.textContent = `${score}/10`;
                
                // Remove all score classes
                scoreElement.classList.remove('bad', 'okey', 'exelent', 'legend');
                
                // Add appropriate class based on score
                if (score <= 3) {
                    scoreElement.classList.add('bad');
                } else if (score <= 6) {
                    scoreElement.classList.add('okey');
                } else if (score <= 9) {
                    scoreElement.classList.add('exelent');
                } else {
                    scoreElement.classList.add('legend');
                }
            }
        });
    }

    // Event listeners
    quizItems.forEach(item => {
        const button = item.querySelector('.start-quiz');
        button.addEventListener('click', function() {
            const quizName = item.querySelector('h3').textContent;
            window.location.href = `quiz.html?quiz=${quizName}`;
        });
    });
    
    if (document.querySelector('.submit-answer')) {
        document.querySelector('.submit-answer').addEventListener('click', submitAnswer);
    }
    
    if (document.querySelector('.answer-input')) {
        document.querySelector('.answer-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitAnswer();
            }
        });
    }
    
    // Initialize quiz if on quiz page
    if (window.location.pathname.includes('quiz.html')) {
        startQuiz();
    }
    
    // Call this when the page loads
    displayQuizScores();
});
