let heartCount;
let clickCount = 0;
let progressValue = 0;
let learnLang;
let gems;

// Make userInfo globally available if it exists
let userInfo = null;

// --- Load user data from session storage with safe defaults ---
const sessionUserData = sessionStorage.getItem('user-info');
if (sessionUserData) {
    userInfo = JSON.parse(sessionUserData);
    gems = userInfo.gems ?? 500;
    heartCount = userInfo.hearts ?? 1000;
    learnLang = userInfo.learnLang || localStorage.getItem('selectedLang') || 'es';
    console.log('Loaded session: hearts=' + heartCount + ' lang=' + learnLang);
} else {
    // No session — use localStorage fallback or safe defaults
    const savedLang = localStorage.getItem('selectedLang');
    const savedHearts = localStorage.getItem('hearts');
    heartCount = savedHearts ? parseInt(savedHearts) : 1000;
    learnLang = (savedLang && savedLang !== 'null') ? savedLang : 'es';
    gems = 500;
    console.warn('No user session found. Using defaults: lang=' + learnLang + ' hearts=' + heartCount);
}



//button click animation
const buttonClickAnimation = (id) => {
    document.getElementById(id).classList.toggle('clicked');
    setTimeout(() => document.getElementById(id).classList.toggle('clicked'), 200);

}


//select option animation toggle
window.selectedOption = 0;

//button-select-animation

const selectOptionButton = (id) => {

    document.getElementById('check-button-div').classList.add('check-button-outer-active');
    document.getElementById('check-button').classList.remove('check-button-inner-inactive')
    document.getElementById('check-button').classList.add('check-button-inner-active')


    selectedOption = parseInt(id);
    console.log(selectedOption)
    document.querySelectorAll('.option-no-selected').forEach((option) => {
        option.classList.remove('option-no-selected');
        option.className = 'option-no'
    })
    document.querySelectorAll('.outer-options-div-selected').forEach((option) => {
        option.classList.remove('outer-options-div-selected');
        option.className = 'outer-options-div'
    });
    document.querySelectorAll('.option-name-selected').forEach((option) => {
        option.classList.remove('option-name-selected');
        option.className = 'option-name'

    });
    document.querySelectorAll('.option-div-selected').forEach((option) => {
        option.classList.remove('.option-div-selected');
        option.className = 'option-div'
    });
    document.getElementById('option-no-' + id).className = 'option-no-selected';
    document.getElementById('option-name-' + id).className = 'option-name-selected';
    document.getElementById(id).className = 'option-div-selected';
    document.getElementById('outer-options-div-' + id).className = 'outer-options-div-selected';

}

//check correct option for different challenges except challenge-select.

let correctOption = (selectedOption) => {

    document.getElementById('option-no-' + selectedOption).className = 'option-no-correct';
    document.getElementById('option-name-' + selectedOption).className = 'option-name-correct';
    document.getElementById(selectedOption).className = 'option-div-correct';
    document.getElementById('outer-options-div-' + selectedOption).className = 'outer-options-div-correct';

}

//set number of hearts in top header
let currentHearts = () => {
    let heartSpan = document.getElementById('heart-count')
    heartSpan.innerText = heartCount;
};

//skip button functionality in bottom row
const skipButton = (id) => {
    // On first click: show wrong state without penalizing hearts
    if (clickCount === 0) {
        document.getElementById(id).classList.toggle('clicked');
        setTimeout(() => document.getElementById(id).classList.toggle('clicked'), 300);
        disablePointer();
        wrongBottomRow();
        progressValue = progressValue + 25;
        updateProgressBar(progressValue);
        // Show the correct answer highlighted
        const correctIdx = localStorage.getItem('correctIndex');
        if (correctIdx !== null) {
            try {
                if ((localStorage.getItem('challenge')) === 'select') {
                    correctSelectOption(parseInt(correctIdx));
                } else {
                    correctOption(parseInt(correctIdx));
                }
            } catch (e) { }
        }
        document.querySelector('#check-button-div').classList.add('check-button-continue');
        document.getElementById('continue-button').textContent = 'Continue';
        clickCount++;
    } else {
        // On second click (Continue): load next question
        questionLoad();
        clickCount = 0;
    }
}

//disable pointer funtionality for all child elements of mid row
let disablePointer = () => {
    const parentDiv = document.querySelector('.mid-row');
    const childElements = parentDiv.getElementsByTagName('*');

    for (const childElement of childElements) {
        childElement.style.pointerEvents = 'none';
    }
}


//reset bottom row ui
const resetBottomRow = () => {
    document.getElementById('skip-span').textContent = "SKIP";

    const skipButtonEl = document.querySelector('.skip-button');
    skipButtonEl.style.display = 'block';

    const bottomRow = document.querySelector('.bottom-row');
    bottomRow.style.backgroundColor = '#FFFFFF';

    const bottomLeftRow = document.querySelector('#correct-left');
    bottomLeftRow.style.display = 'none';
    const wrongBottomLeftRow = document.querySelector('#wrong-left');
    wrongBottomLeftRow.style.display = 'none';

    document.getElementById('continue-button').textContent = 'CHECK';
    document.querySelector('#check-button-div').classList.remove('check-button-continue');
    document.querySelector('#check-button-div').classList.remove('check-button-outer-active');
    document.querySelector('#check-button-div').classList.remove('check-button-outer-wrong');

    document.getElementById('check-button').classList.remove('check-button-inner-active');
    document.getElementById('check-button').classList.remove('check-button-inner-wrong');
    document.getElementById('check-button').classList.add('check-button-inner-inactive');
}

//check answer comparing the index value

let checkButton = (id) => {

    disablePointer();

    //correct answer properties
    if (localStorage.getItem('correctIndex') == window.selectedOption) {

        if ((localStorage.getItem('challenge')) == 'select') {
            correctSelectOption(selectedOption)
        }
        else {
            correctOption(selectedOption);
        }
        if (clickCount == 0) {
            correctBottomRow();

            progressValue = progressValue + 25;
            updateProgressBar(progressValue);
            const audio = new Audio('./assets/audio/correct-sound.mp3');
            audio.play();
            xpCount = xpCount + 2;
        }

    }
    //wrong answer properties

    else {
        if (clickCount == 0) {
            wrongBottomRow();

            progressValue = progressValue + 25;
            updateProgressBar(progressValue);
            document.getElementById("heart-count").textContent = heartCount - 1;
            heartCount = heartCount - 1;
            const audio = new Audio('./assets/audio/wrong-sound.mp3');
            audio.play();
        }
    }
    //check button to continue button
    document.querySelector('#check-button-div').classList.add('check-button-continue');
    document.getElementById(id).classList.toggle('clicked');
    setTimeout(() => document.getElementById(id).classList.toggle('clicked'), 300);
    document.getElementById('continue-button').textContent = 'Continue';
    clickCount++;

    //continue to next question functionality
    if (clickCount >= 2) {
        questionLoad();
        clickCount = 0;
    }
}

//correct answer ui

const correctBottomRow = () => {
    const skipButton = document.querySelector('.skip-button');
    skipButton.style.display = 'none';
    const bottomLeftRow = document.querySelector('#correct-left');
    bottomLeftRow.style.display = 'block';
    const bottomRow = document.querySelector('.bottom-row');
    bottomRow.style.backgroundColor = '#d7ffb8';
}
//wrong answer ui
const wrongBottomRow = () => {
    const bottomRow = document.querySelector('.bottom-row');
    bottomRow.style.backgroundColor = '#ffdfe0';
    const skipButton = document.querySelector('.skip-button');
    skipButton.style.display = 'none';
    const bottomLeftRow = document.querySelector('#wrong-left');
    bottomLeftRow.style.display = 'block';
    let solution = localStorage.getItem("solution");
    document.querySelector(".solution-text").textContent = solution;
    document.getElementById('check-button-div').classList.add('check-button-outer-wrong');
    document.getElementById('check-button').classList.remove('check-button-inner-active');
    document.getElementById('check-button').classList.add('check-button-inner-wrong');
}

let questionCount = 1;
let xpCount = -1;

//load question by fetching from serverless endpoint
let questionLoad = () => {

    // let learnLang = localStorage.getItem("selectedLang");
    fetch(`http://localhost:3000/api/question?lang=${learnLang}`)
        .then(response => {
            if (!response.ok) throw new Error('API server down');
            return response.json();
        })
        .catch(error => {
            console.warn('API fetch failed, trying local fallback:', error);
            return fetch(`./assets/JSON/questions-${learnLang}.json`).then(res => res.json());
        })
        .then(data => {
            //questionarie page funtionality
            let index = Math.floor(Math.random() * data.challenges.length);
            if (questionCount < 5) {
                if (heartCount > 0) {
                    console.log(data.challenges[index]);
                    console.log(data.challenges[index].type);
                    if (data.challenges[index].type == "assist") {
                        resetBottomRow();
                        console.log("inner");
                        challengeAssist(data.challenges[index]);
                        questionCount++;

                    }
                    else if (data.challenges[index].type == "dialogue") {
                        resetBottomRow();
                        challengeDialogue(data.challenges[index]);
                        questionCount++;

                    }
                    else if (data.challenges[index].type == "selectTranscription") {
                        resetBottomRow();
                        challengeTranscription(data.challenges[index]);
                        questionCount++;

                    }
                    else if (data.challenges[index].type == "select") {
                        resetBottomRow();
                        challengeSelect(data.challenges[index]);
                        questionCount++;

                    }
                    else if (data.challenges[index].type == "readComprehension") {
                        resetBottomRow();
                        challengeReadComprehension(data.challenges[index]);
                        questionCount++;
                    }
                    else {
                        questionLoad();

                    }
                }
                else {
                    showShopPopup();
                }
            }
            else {
                // Determine new xp and hearts
                let newXp = (parseInt(userInfo?.xp) || 0) + xpCount + 1;
                let newHearts = heartCount;
                let newCompletedLessons = (parseInt(userInfo?.currentLesson) || 0) + 1;

                localStorage.setItem('xpCount', xpCount + 1);
                localStorage.setItem('hearts', newHearts);

                // Update session storage immediately
                if (userInfo) {
                    userInfo.xp = newXp;
                    userInfo.hearts = newHearts;
                    userInfo.currentLesson = newCompletedLessons;
                    sessionStorage.setItem('user-info', JSON.stringify(userInfo));

                    // Save to backend API
                    fetch(`/api/users/${userInfo.id || userInfo.userId}/progress`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            xp: newXp,
                            gems: userInfo.gems || 500,
                            hearts: newHearts,
                            currentLesson: newCompletedLessons
                        })
                    }).then(res => res.json())
                        .then(data => console.log('Progress saved:', data))
                        .catch(err => console.error('Failed to save progress:', err));
                }

                lessonComplete();
                console.log("Ended the questionaire");
                xpCount = -1;
            }

        })

        .catch(error => {
            console.error('Error fetching choices:', error);
        });
}


window.onload = setTimeout(() => questionLoad());



//lesson complete animation with stats

let lessonComplete = () => {
    document.querySelector('.mid-row').style.overflow = 'hidden';
    const audio = new Audio('./assets/audio/humanense-lesson.mp3');
    audio.play();
    clickCount = 0;
    resetBottomRow();
    document.getElementById('check-button-div').classList.add('check-button-outer-active');
    document.getElementById('check-button').classList.remove('check-button-inner-inactive')
    document.getElementById('check-button').classList.add('check-button-inner-active');
    document.getElementById('continue-button').textContent = 'Continue'


    document.querySelector('.mid-row').innerHTML = '';
    document.querySelector('.top-row-question-page-sections').innerHTML = '';
    let lessonCompleteContainer = document.createElement('div');
    lessonCompleteContainer.className = 'lesson-complete';

    let lottieLesson = document.createElement('div');
    lottieLesson.id = 'lottie-lesson';

    let appreciationContainer = document.createElement('div');
    appreciationContainer.className = 'lesson-appreciation';

    let appreciationHead = document.createElement('div');
    appreciationHead.className = 'appreciation-head';
    appreciationHead.textContent = 'Lesson Complete';

    let appreciationBody = document.createElement('div');
    appreciationBody.className = 'appreciation-body';
    appreciationBody.textContent = 'You have completed this lesson';

    let lessonStatsContainer = document.createElement('div');
    lessonStatsContainer.className = 'lesson-stats';

    // XP container
    let xpOuter = document.createElement('div');
    xpOuter.className = 'xp-outer';

    let lessonXp = document.createElement('div');
    lessonXp.className = 'lesson-xp';

    let xpHead = document.createElement('div');
    xpHead.className = 'lesson-head';
    xpHead.id = 'xp-head';
    xpHead.textContent = 'TOTAL XP';

    let innerXpContainer = document.createElement('div');
    innerXpContainer.className = 'inner-xp-container inner-xp-container-xp';

    let xpImage = document.createElement('img');
    xpImage.src = './assets/svg/lesson-xp.svg';

    let xpSpan = document.createElement('span');
    xpSpan.textContent = localStorage.getItem("xpCount");

    appreciationContainer.appendChild(appreciationHead);
    appreciationContainer.appendChild(appreciationBody);


    innerXpContainer.appendChild(xpImage);
    innerXpContainer.appendChild(xpSpan);

    xpOuter.appendChild(lessonXp);
    xpOuter.appendChild(xpHead);
    xpOuter.appendChild(innerXpContainer);

    // Percent container
    let percentOuter = document.createElement('div');
    percentOuter.className = 'xp-outer';

    let lessonPercent = document.createElement('div');
    lessonPercent.className = 'lesson-percent';

    let percentHead = document.createElement('div');
    percentHead.className = 'lesson-head';
    percentHead.id = 'percent-head';
    percentHead.textContent = 'TRY HARDER';

    let innerPercentContainer = document.createElement('div');
    innerPercentContainer.className = 'inner-xp-container inner-xp-container-percent';

    let percentImage = document.createElement('img');
    percentImage.src = './assets/svg/lesson-percent.svg';

    let percentSpan = document.createElement('span');
    percentSpan.textContent = (localStorage.getItem("xpCount") / 8) * 100 + "%";

    innerPercentContainer.appendChild(percentImage);
    innerPercentContainer.appendChild(percentSpan);

    percentOuter.appendChild(lessonPercent);
    percentOuter.appendChild(percentHead);
    percentOuter.appendChild(innerPercentContainer);

    lessonStatsContainer.appendChild(xpOuter);
    lessonStatsContainer.appendChild(percentOuter);

    lessonCompleteContainer.appendChild(lottieLesson);
    lessonCompleteContainer.appendChild(appreciationContainer);
    lessonCompleteContainer.appendChild(lessonStatsContainer);
    switchCount = 0;

    // Append the main container to the 'mid-row' class
    let midRow = document.querySelector('.mid-row');
    midRow.appendChild(lessonCompleteContainer);
    let continueButton = document.getElementById('check-button');
    // Remove the inline onclick event so it doesn't fire `checkButton` again
    continueButton.onclick = null;
    continueButton.addEventListener('click', switchToLearn)

    document.querySelector('.skip-button').style.display = 'none';
    document.querySelector('#correct-left').style.display = 'none';
    document.querySelector('#wrong-left').style.display = 'none';

    //fetch lottie animation

    let animationPath = './assets/json-animations/lesson-complete.json';
    const animation = bodymovin.loadAnimation({
        container: document.getElementById('lottie-lesson'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: animationPath
    });

}

//switch to learnpage

const switchToLearn = () => {

    switchCount++;

    if (switchCount === 1) {
        window.location.href = './learn.html';
    }

}

//prgogress bar update functionality
const updateProgressBar = (progressValue) => {
    var progressBar = document.querySelector(".inner-green-bar");
    var lightProgressBar = document.querySelector(".inner-light-green-bar");
    lightProgressBar.style.width = progressValue + "%";
    progressBar.style.width = progressValue + "%";
}

//revert exit overlay to questionaire screen
const revertQuestionScreen = () => {
    document.querySelector('.exit-overlay').classList.toggle('clicked');
    setTimeout(() => document.querySelector('.exit-overlay').classList.toggle('clicked'), 400);
    document.querySelector('.exit-overlay').style.display = 'none'
}

//heart zero shop popup 
let showShopPopup = () => {
    document.getElementById("gem-count-text").textContent = gems;
    localStorage.setItem('xpCount', xpCount + 1);
    localStorage.setItem('hearts', heartCount)
    document.querySelector('.shop-overlay').style.display = 'flex'
}

//exit alert popup 

let showAlertPopup = () => {
    document.querySelector('.exit-overlay').style.display = 'flex'
}

//navigate to shop page
let goToShop = () => {
    window.location.href = './shoppingpage.html';
}

//navigate to learn page

let exitToLearn = () => {
    localStorage.setItem('xpCount', xpCount + 1);
    localStorage.setItem('hearts', heartCount)
    window.location.href = './learn.html';
}

// correct option animation for challenge select
let correctSelectOption = (selectedOption) => {
    document.getElementById('option-no-' + selectedOption).className = 'option-no-correct';
    document.getElementById('select-div-option-name-' + selectedOption).className = 'option-name-correct';
    document.getElementById(selectedOption).className = 'select-option-div-correct';
    document.getElementById('select-outer-option-div-' + selectedOption).className = 'select-outer-options-div-correct';

}