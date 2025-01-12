let trivApi = "https://opentdb.com/api.php?amount=10";
const easyApi = trivApi + "&difficulty=easy";
const midApi = trivApi + "&difficulty=medium";
const hardApi = trivApi + "&difficulty=hard";

let apiKey = "vl3EiNGXGZACABgTOliTXjU9okdiloezxhaMKUbYUjrxY05suMB9fibD";

window.onload = function () {
    grabUrl();
};

async function grabUrl() {
    try {
        const response = await fetch(trivApi);
        const data = await response.json();
        console.log(data);
        qAs(data);
        imgDelivery(data);
    } catch (error) {
        console.error("Error Fetching API", error);
    }
}

async function qAs(data) {
    let container = document.getElementById("container");
    container.innerHTML = "";

    for (let i = 0; i < data.results.length; i++) {
        // Create question container
        let questionDiv = document.createElement("div");
        questionDiv.className = "question";

        // Display question text
        let quest = document.createElement("h3");
        quest.innerText = data.results[i].question;
        questionDiv.appendChild(quest);

        // Display difficulty
        let difficultyDiv = document.createElement("p");
        difficultyDiv.className = "difficulty";
        difficultyDiv.innerHTML = `<strong>Difficulty:</strong> ${data.results[i].difficulty}`;
        questionDiv.appendChild(difficultyDiv);

        // Create answers container
        let answersDiv = document.createElement("div");
        answersDiv.className = "answers";

        // Add correct answer
        let correctAnswer = document.createElement("div");
        correctAnswer.innerText = data.results[i].correct_answer;
        correctAnswer.className = "correct";
        answersDiv.appendChild(correctAnswer);

        // Add incorrect answers
        data.results[i].incorrect_answers.forEach(incorrect => {
            let incorrectAnswer = document.createElement("div");
            incorrectAnswer.innerText = incorrect;
            incorrectAnswer.className = "incorrect";
            answersDiv.appendChild(incorrectAnswer);
        });

        container.appendChild(questionDiv);
        container.appendChild(answersDiv);
    }
}

async function fetchPexelsData(data) {
    let correctAnswer = data.results[0].correct_answer;
    let question = data.results[0].question;
    let query = `${correctAnswer} ${question}`.replace(/\s+/g, "");
    
    const url = `https://api.pexels.com/v1/search?per_page=1&query=${query}`;
    const headers = {
        Authorization: apiKey
    };

    try {
        const response = await fetch(url, { headers });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const imageData = await response.json();
        console.log(imageData);
        return imageData;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function imgDelivery(data) {
    try {
        const imageData = await fetchPexelsData(data);
        if (imageData && imageData.photos && imageData.photos.length > 0) {
            let image = document.createElement("img");
            image.src = imageData.photos[0].src.medium; // Ensure that photo object exists and is defined.
            document.getElementById("container").appendChild(image);
        } else {
            console.error("No image data found.");
        }
    } catch (error) {
        console.error("Error delivering image:", error);
    }
}
