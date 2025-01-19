let trivApi = "https://opentdb.com/api.php?amount=10";
const easyApi = trivApi + "&difficulty=easy";
const midApi = trivApi + "&difficulty=medium";
const hardApi = trivApi + "&difficulty=hard";
let score = 0;

let apiKey = "vl3EiNGXGZACABgTOliTXjU9okdiloezxhaMKUbYUjrxY05suMB9fibD";

async function grabUrl() {

    try {
        const response = await fetch(trivApi);
        const data = await response.json();
        console.log(data);
        qAs(data); // Render questions and answers
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

async function qAs(data) {
    let container = document.getElementById("container");
    container.innerHTML = ""; // Clear previous content

    let currentQuestionIndex = 0;

    function renderQuestion(index) {
        container.innerHTML = ""; // Clear previous question
    
        if (index >= data.results.length) {
            // All questions answered
            let message = document.createElement("h2");
            message.innerHTML = `Done <br> Score: ${score}/10`;
            container.appendChild(message);
            return;
        }
    
        // Create question container
        let questionDiv = document.createElement("div");
        questionDiv.className = "question";
    
        // Display question text
        let quest = document.createElement("h3");
        quest.innerHTML = data.results[index].question;
        questionDiv.appendChild(quest);
    
        // Display difficulty
        let difficultyDiv = document.createElement("p");
        difficultyDiv.className = "difficulty";
        difficultyDiv.innerHTML = `<strong>Difficulty:</strong> ${data.results[index].difficulty}`;
        questionDiv.appendChild(difficultyDiv);
    
        // Fetch and display an image
        const query = `${data.results[index].question} ${data.results[index].correct_answer}`;
        fetchPexelsData(query).then((imageUrl) => {
            if (imageUrl) {
                const img = document.createElement("img");
                img.src = imageUrl;
                img.alt = `Image for ${data.results[index].question}`;
                img.className = "imageQ";
                questionDiv.appendChild(img); // Append image to question div
            } else {
                console.error(`No image found for question: ${data.results[index].question}`);
            }
        });
    
        // Create answers container
        let answersDiv = document.createElement("div");
        answersDiv.className = "answers";
    
        let array = [];
        // Add correct answer
        let correctAnswer = data.results[index].correct_answer;
        array.push(correctAnswer);
    
        // Add incorrect answers
        data.results[index].incorrect_answers.forEach((incorrect) => {
            array.push(incorrect);
        });
    
        // Shuffle answers
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
    

    // Start by rendering the first question
    renderQuestion(currentQuestionIndex);
}


function confirmAns(correctAnswer, clickedButton) 
{
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
}


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
