let trivApi = "https://opentdb.com/api.php?amount=10";
const easyApi = trivApi + "&difficulty=easy";
const midApi = trivApi + "&difficulty=medium";
const hardApi = trivApi + "&difficulty=hard";

let apiKey = "vl3EiNGXGZACABgTOliTXjU9okdiloezxhaMKUbYUjrxY05suMB9fibD";

async function grabUrl() {

    try {
        const response = await fetch(trivApi);
        const data = await response.json();
        console.log(data);
        qAs(data); // Render questions and answers
        await imgDelivery(data); // Attach corresponding images
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
    container.innerHTML = "";

    for (let i = 0; i < data.results.length; i++) {
        // Create question container
        let questionDiv = document.createElement("div");
        questionDiv.className = "question";

        // Display question text
        let quest = document.createElement("h3");
        quest.innerHTML = data.results[i].question;
        questionDiv.appendChild(quest);

        // Display difficulty
        let difficultyDiv = document.createElement("p");
        difficultyDiv.className = "difficulty";
        difficultyDiv.innerHTML = `<strong>Difficulty:</strong> ${data.results[i].difficulty}`;
        questionDiv.appendChild(difficultyDiv);

        // Create answers container
        let answersDiv = document.createElement("div");
        answersDiv.className = "answers";

        let array = [];
        // Add correct answer
        let correctAnswer = data.results[i].correct_answer;
        array.push(correctAnswer)

        // Add incorrect answers
        data.results[i].incorrect_answers.forEach((incorrect) => {
            array.push(incorrect)
        });

        array.sort(() => Math.random() - .5);

        for(j in array)
        {
            answer = document.createElement('button');
            answer.id = 'answer';
            answer.innerHTML = array[j];
            answer.addEventListener('click', function(){
                confirmAns(correctAnswer, array[j])
            }
        )
            answersDiv.appendChild(answer);
        }

        // Append question and answers to container
        container.appendChild(questionDiv);
        container.appendChild(answersDiv);
    }
}

function confirmAns(correctAnswer, answer)
{
    answer = document.getElementById('answer');
    if (answer == correctAnswer)
    {
        answer.style.backgroundColor = '#00FF00'
        // answer.style.display = 'none';
    }
    else
    {
        answer.style.backgroundColor = '#FF0000'
        // answer.style.display = 'none';
    }

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

async function imgDelivery(data) {
    const container = document.getElementById("container");
    const questionElements = document.querySelectorAll(".question");

    for (let i = 0; i < data.results.length; i++) {
        const query = `${data.results[i].question} ${data.results[i].correct_answer}`;
        const imageUrl = await fetchPexelsData(query);

        if (imageUrl) {
            // Create an image element
            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = `Image for ${data.results[i].question}`;
            img.className = "imageQ";

            // Append the image to the corresponding question
            questionElements[i].appendChild(img);
        } else {
            console.error(`No image found for question: ${data.results[i].question}`);
        }
    }
}
