let baseApi = "https://opentdb.com/api.php?amount=10";
const easyApi = baseApi + "&difficulty=easy";
const midApi = baseApi + "&difficulty=medium";
const hardApi = baseApi + "&difficulty=hard";
let disQ;
let disO;
let difficulty;


window.onload = function ()
{
    grabUrl();
}
async function grabUrl()
{
    try
    {
    const response = await fetch(baseApi);
    const data = await response.json();
    console.log(data);
    qAs(data);
    }
    catch(error)
    {
        console.error("Error Fetching Api", error);
    }

}

async function qAs (data)
{
    let container = document.getElementById("container");
    container.innerHTML = '';   
    for(i in data.results)
    {
        difficulty = document.getElementById("difficulty"); 
        difficulty.innerHTML = `<span>Difficulty:</span>` + `<span>${data.results[i].difficulty}</span>` + `<br>` + `<br>`;
    
        let questions = document.createElement('div');

        let quest = document.createElement('h3');
        quest.innerHTML = data.results[i].question;
        questions.appendChild(quest);

        //`<p>${data.results[i].question}</p>`  + `<br>`  + `<br>`;

        let answers = document.createElement('div');

        let ans = document.createElement('div')
        ans.innerHTML = data.results[i].correct_answer;
        answers.appendChild(ans);
    
        for(j in data.results[i].incorrect_answers)
        {
            answers.innerHTML += `<div class="buttons">${data.results[i].incorrect_answers[j]} </div>`;
        }
        container.appendChild(questions);
        container.appendChild(answers);
    }
}

