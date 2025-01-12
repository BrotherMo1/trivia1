let trivApi = "https://opentdb.com/api.php?amount=10";
const easyApi = trivApi + "&difficulty=easy";
const midApi = trivApi + "&difficulty=medium";
const hardApi = trivApi + "&difficulty=hard";
let apiKey = "vl3EiNGXGZACABgTOliTXjU9okdiloezxhaMKUbYUjrxY05suMB9fibD";
let disQ;
let disO;
let difficulty;


window.onload = function ()
{
    grabUrl();
    // imgSearch();
}
async function grabUrl()
{
    try
    {
    const response = await fetch(trivApi);
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
    imgDelivery(data);
}

// let query = 'apple';
// async function imgSearch(query){
//     // fetch the data from api
//     try {
//         const data=await
// fetch(`https://api.pexels.com/v1/search?query=${query}?orientation=square
// `,
//             {
//                 method: "GET",
//                 headers: {
//                     Accept: "application/json",
//                     Authorization: apiKey,       
//                 },
//             });
//             const response=await data.json(); 
//             console.log(response);
//     } catch (error) {
//         console.error('Error fetching image:', error);

//     }

// }

async function fetchPexelsData(data, search) {
    let search = data.results[0].correct_answer + data.results[0].question
    let res = search.split(" ").join("");
    console.log(res);
    const url = "https://api.pexels.com/v1/search?per_page=1&query=" + search;
    const headers = {
        "Authorization": apiKey
    };

    try {
        const response = await fetch(url, { headers });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data1 = await response.json();
        console.log(data1);
        return data1;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function imgDelivery (data)
{

    fetchPexelsData(data.results[0].correct_answer, data.results[0].question);
    console.log(data.results[0].question, data.results[0].correct_answer);
}

