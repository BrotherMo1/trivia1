let baseApi = "https://opentdb.com/api.php?amount=10";
const easyApi = baseApi + "&difficulty=easy";
const midApi = baseApi + "&difficulty=medium";
const hardApi = baseApi + "&difficulty=hard";
let disQ;
let disO;
let difficulty;

async function grabUrl()
{
    try
    {
    const response = await fetch(baseApi);
    const data = await response.json();


    difficulty = document.getElementById("difficulty"); 
    difficulty.innerHTML = `<span>Difficulty:</span>` + `<span>${data.results[0].difficulty}</span>` + `<br>` + `<br>`;

    disQ = document.getElementById("disQ"); 
    disQ.innerHTML = `<span>${data.results[0].question}</span>`  + `<br>`  + `<br>`;
    
    disO = document.getElementById("disO"); 
    disO.innerHTML = `<button class="buttons">${data.results[0].correct_answer}</button>`+  `<br>`;

    for(i in data.results[0].incorrect_answers)
    {
        disQ.innerHTML += `<button class="buttons">${data.results[0].incorrect_answers[i]} </button>` + `<br>`;
    }

    console.log(data);
    return data;
    }

    catch(error)
    {
        console.error("Error Fetching Api", error);
    }

}

grabUrl();