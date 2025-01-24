let trivApi = "https://opentdb.com/api.php?amount=10";
const easyApi = trivApi + "&difficulty=easy";
const midApi = trivApi + "&difficulty=medium";
const hardApi = trivApi + "&difficulty=hard";
let score = 0;
let time;
let timeStart = 0;
let interval;
let timeLeft = 0;
let currentQuestionIndex = 0;
let q;

let apiKey = "vl3EiNGXGZACABgTOliTXjU9okdiloezxhaMKUbYUjrxY05suMB9fibD";



// make game installable
// handle install prompt
// Ms wear give code
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installButton = document.getElementById('installButton');
  installButton.style.display = 'block';

  installButton.addEventListener('click', () => {
    installButton.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  });
});                        
  
function reset()
{
    //https://www.w3schools.com/jsref/met_loc_reload.asp
    location.reload();
}

async function grabUrl() {

    try {
        const response = await fetch(trivApi);
        q = await response.json();
        console.log(q);
        qAs(); // Render questions and answers
    } catch (error) {
        console.error("Error Fetching API", error);
    }
}

async function categories() {
    let url = "https://opentdb.com/api_category.php";

    try {
        const response = await fetch(url);
        const data = await response.json();

        let cate = document.getElementById('catelist');

        data.trivia_categories.forEach((category) => {
            let option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            cate.appendChild(option);
        });
    } catch (error) {
        console.error("Couldn't Fetch Categories", error);
    }
}
function handleSubmit(event) {
    event.preventDefault(); // Prevent form submission

    let selectedCategory = document.getElementById("catelist").value;
    let difficulty = document.getElementById("difficulty").value;

    // Set API based on user selection
    if (selectedCategory) {
        trivApi = `https://opentdb.com/api.php?amount=10&category=${selectedCategory}&difficulty=${difficulty}`;
    } else {
        trivApi = `https://opentdb.com/api.php?amount=10&difficulty=${difficulty}`;
    }

    console.log("Updated trivApi:", trivApi);

    // Fetch questions based on updated trivApi
    grabUrl();
    document.getElementById("submission").style.display = "none";
        // Clear the text 
        document.getElementById("intro").innerHTML = "";
}

// Populate the dropdown on page load
window.onload = categories;

async function qAs() {
    let container = document.getElementById("container");
    container.innerHTML = ""; // Clear previous content
    // Start by rendering the first question
    renderQuestion(currentQuestionIndex);
    timerStart(10);
}
    
function renderQuestion(index) {
    container.innerHTML = ""; // Clear previous question
    if (index >= q.results.length) {
        // All questions answered
        let message = document.createElement("h2");
        message.innerHTML = `Congratulations You got <br> Score: ${score}/10`;
        message.innerHTML += `<br> <br> <div id=emojies><img src="partFaceE.png" alt="face" id="emof"> <img src="partpop.png" alt="confeti" id="confet"> </div>`;
        clearInterval(interval);
        document.getElementById('time').innerHTML = ""; // Clear the timer display
        container.appendChild(message);
        return;
    }

    // Create question container
    let questionDiv = document.createElement("div");
    questionDiv.className = "question";

    // Display question text
    let quest = document.createElement("h3");
    quest.innerHTML = q.results[index].question;
    questionDiv.appendChild(quest);

    // Display difficulty
    let difficultyDiv = document.createElement("p");
    difficultyDiv.className = "difficulty";
    difficultyDiv.innerHTML = `<br> <strong>Difficulty:</strong> ${q.results[index].difficulty} <br>`;
    questionDiv.appendChild(difficultyDiv);

    // Fetch and display an image
    const query = `${q.results[index].question} ${q.results[index].correct_answer}`;
    fetchPexelsData(query).then((imageUrl) => {
        if (imageUrl) {
            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = `Image for ${q.results[index].question}`;
            img.className = "imageQ";
            questionDiv.appendChild(img); // Append image to question div
        } else {
            console.error(`No image found for question: ${q.results[index].question}`);
        }
    });

    // Create answers container
    let answersDiv = document.createElement("div");
    answersDiv.className = "answers";

    let array = [];
    // Add correct answer
    let correctAnswer = q.results[index].correct_answer;
    array.push(correctAnswer);

    // Add incorrect answers
    q.results[index].incorrect_answers.forEach((incorrect) => {
        array.push(incorrect);
    });

    // Shuffle answers
    // https://coureywong.medium.com/how-to-shuffle-an-array-of-items-in-javascript-39b9efe4b567
    array.sort(() => Math.random() - 0.5);


    for (let j = 0; j < array.length; j++) {
        let answer = document.createElement("button");
        answer.className = "answer";
        answer.innerHTML = array[j];

        // Add click event listener for the answer
        answer.addEventListener("click", function () {
            confirmAns(correctAnswer, this);
            currentQuestionIndex++; // Increment the question index
            setTimeout(() => renderQuestion(currentQuestionIndex), 1000); // Show the next question after 1 second
        });

        answersDiv.appendChild(answer);
    }

    // Append question and answers to container
    container.appendChild(questionDiv);
    container.appendChild(answersDiv);
}




function confirmAns(correctAnswer, clickedButton) {
    if (clickedButton.innerHTML === correctAnswer) {
        clickedButton.style.backgroundColor = "#00FF00";
        score += 1;
    } else {
        clickedButton.style.backgroundColor = "#FF0000";
    }

    // Disable all buttons after a choice
    const buttons = clickedButton.parentElement.querySelectorAll(".answer");
    buttons.forEach((button) => {
        button.disabled = true; // Disable all buttons
    });

    // Clear the existing timer interval
    clearInterval(interval);
    // Reset the timer and start again for the next question
    timerStart(10);
}


//kuwar taught me how to use timers properly
function timerStart(duration) {
    let time = duration, minutes, seconds;
    timeStart = Date.now() + 1000; 

    interval = setInterval(() => {
        minutes = parseInt(time / 60, 10);
        seconds = parseInt(time % 60, 10);
        
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        
        document.getElementById('time').innerHTML = minutes + ":" + seconds + " " + "seconds left";
        
        if (--time < 0) {
            time = duration;  // Reset timer to original duration
            currentQuestionIndex++; // Move to the next question
            renderQuestion(currentQuestionIndex); // Render the next question++
            document.getElementById('time').innerHTML = ""; // Clear the timer display
            clearInterval(interval);  // Stop the current interval
            timerStart(duration); // Start a new timer
        }
    }, 1000);
}

//ms wear given code
async function fetchPexelsData(query) {
    const url = `https://api.pexels.com/v1/search?per_page=1&query=${encodeURIComponent(query)}`;
    const headers = {
        Authorization: apiKey,
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const imageData = await response.json();
        return imageData.photos[0]?.src.medium || null; // Return the image URL or null
    } catch (error) {
        console.error("Error fetching Pexels data:", error);
        return null; // Return null on failure
    }
}         

// sw
//fromMsWear
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('sw.js').then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
      }, function(error) {
        console.log('Service Worker registration failed:', error);
      });
    });
  }                    
        