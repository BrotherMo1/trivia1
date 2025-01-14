
let trivApi = "https://opentdb.com/api.php?amount=10";
const easyApi = trivApi + "&difficulty=easy";
const midApi = trivApi + "&difficulty=medium";
const hardApi = trivApi + "&difficulty=hard";
let catelist = document.getElementById("catelist");
let option;

let apiKey = "vl3EiNGXGZACABgTOliTXjU9okdiloezxhaMKUbYUjrxY05suMB9fibD";

async function grabUrl(num) {
    if (num == 1)
        {
          trivApi = trivApi;
        }
        else if (num == 2)
        {
          trivApi = easyApi;
        }
        else if (num == 3)
        {
          trivApi = midApi;
        }
        else 
        {
              trivApi = hardApi;
        }
    
    try {
        const response = await fetch(trivApi);
        const data = await response.json();
        console.log(data);
        // categories(data);
        qAs(data);  // Render questions and answers
        await imgDelivery(data);  // Attach corresponding images
    } catch (error) {
        console.error("Error Fetching API", error);
    }
}

async function categories() {
    let url = "https://opentdb.com/api_category.php";

    try
    {
        const response = await fetch(url);
        const data = await response.json();
        let cate =  document.getElementById('catelist');

        data.trivia_categories.forEach (category => {
            option = document.createElement('option');
            option.value = category.id;
            option.innerHTML = category.name;
            cate.appendChild(option);
        });
        let urlCate = trivApi + "&category=" + data.trivia_categories.id;
        console.log(urlCate);
    }catch(error)
    {
        console.error("Couldn't Fetch Categories", error);
    }
  }

  window.onload = function ()
  {
    categories();
  }

async function qAs(data) {
    let container = document.getElementById("container");
    container.innerHTML = "";

    for (let i = 0; i < data.results.length; i++) 
        {
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

        // Add correct answer
        let correctAnswer = document.createElement("div");
        correctAnswer.innerHTML = data.results[i].correct_answer;
        correctAnswer.className = "correct";
        answersDiv.appendChild(correctAnswer);

        // Add incorrect answers
        data.results[i].incorrect_answers.forEach(incorrect => {
            let incorrectAnswer = document.createElement("div");
            incorrectAnswer.innerHTML = incorrect;
            incorrectAnswer.className = "incorrect";
            answersDiv.appendChild(incorrectAnswer);
        });

        // Append question and answers to container
        container.appendChild(questionDiv);
        container.appendChild(answersDiv);
    }
}

async function fetchPexelsData(query) {
    const url = `https://api.pexels.com/v1/search?per_page=1&query=${encodeURIComponent(query)}`;
    const headers = 
    {
        Authorization: apiKey
    };

    try 
    {
        const response = await fetch(url, { headers });
        if (!response.ok) 
        {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const imageData = await response.json();
        console.log(imageData);
        return imageData.photos[0]?.src.medium || null; // Return the image URL or null
    } catch (error) 
    {
        console.error("Error fetching Pexels data:", error);
        return null; // Return null on failure
    }
}

async function imgDelivery(data) {
    const container = document.getElementById("container");
    const questionElements = document.querySelectorAll(".question");

    for (let i = 0; i < data.results.length; i++) 
        {
        const query = `${data.results[i].question} ${data.results[i].correct_answer}`;
        console.log(query);
        const imageUrl = await fetchPexelsData(query);

        if (imageUrl) 
        {
            // Create an image element
            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = `Image for ${data.results[i].question}`;
            img.className = "imageQ";

            // Append the image to the corresponding question
            questionElements[i].appendChild(img);
        } else 
            {
            console.error(`No image found for question: ${data.results[i].question}`);
            }
        }
}
