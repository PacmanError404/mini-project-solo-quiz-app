let score = 0;
let solved = 0;
let sumbit = document.getElementById("submit")

let timerID;
let timeLeft = 60;

const startTimer = (value)=>{
  if(value=='EASY') {timeLeft=59}
  if(value=='MEDIUM') {timeLeft=29}
  if(value=='HARD') {timeLeft=15}

    if (timeLeft > 0) {
        timeLeft--;

      timerID = setTimeout(startTimer, 1000);
    } else {
        alert("Time's up!");
    }


}


const startQuiz = async ()=>{      
  let offset = 0;
  let limit = 50;
  console.log(difficulty.value)
  console.log(questions.value)
  console.log(category.value)      
    const response = await fetch(
  `https://quizapi.io/api/v1/questions?offset=${offset}&limit=${limit}`,
  {
    headers: {
      "Authorization": "Bearer qa_sk_e25940c74639bf5a8bbd7b41b6c54098608d1d25",
      "Content-Type": "application/json",
    },
  }
);


for(let i=0;i<questions.value;i++){
  document.getElementsByClassName("question-board")[0].innerHTML += `<div id="${i+1}" class="question-pallet" issolved="false">${i+1}</div>`
}

const response2 = await response.json();
let data = response2.data;
console.log("this is api from start")
let result = data.filter((data)=>data.category===category.value)
console.log(response2)
console.log(result)

document.getElementsByTagName('main')[0].style.display='none';
document.getElementsByTagName('main')[1].style.display='flex';
document.getElementById('quiz-interface').style.visibility='visible';

console.log(result)
let percentage = (solved/questions.value)*100;
const loadQuestion = ()=>{
let quizPage = document.getElementById('quiz-page')
result.map((result,id)=>
  quizPage.innerHTML+=
  `<div class="quiz-board board hidden">
                <div class="question-info">
                    <div class="question-params">
                        <div id="${id+1}">Question ${id+1} of ${questions.value}</div>
                    </div>
                        <div id="question-timer">00:00</div>
                </div>
                <div class="quiz-progress"></div>
                <div class="question-panel">
                    <div id="question-slide">
                        <div class="question" id="${result.id}">${result.text}</div>
                        <div class="question-type">Multiple Answer</div>
                    </div>
                    <div class="question-feature">Click on the checkbox</div>
                    <div id="question-option">
                    ${result.answers.map((answer)=>
                      `<label class="input" for="input" id="${id}">
                      <input type="radio" id="${answer.id}" value="${answer.isCorrect}"/><p>${answer.text}</p>
                      </label>`
                    ).join("")}
                    <div id="question-browser">
                        <button class="previous">Previous</button>
                        <button class="submit">Submit</button>
                        <button class="next">Next</button>
                    </div>`
)

}

loadQuestion();


let j = 0;
document.getElementsByClassName('quiz-board')[j].classList.remove("hidden")

let previous = document.querySelectorAll(".previous")
previous.forEach(previous=>{
  previous.addEventListener('click',()=>{
  console.log('previous');
  if(j){
  document.getElementsByClassName('quiz-board')[j].classList.add("hidden")
  j--;
  document.getElementsByClassName('quiz-board')[j].classList.remove("hidden")
  }
})
})

let next = document.querySelectorAll(".next")
next.forEach(next=>{
  next.addEventListener('click',()=>{
  if(j<questions.value-1){
  console.log('next');
  startTimer(difficulty.value);
  console.log("timer starts")
  document.getElementsByClassName('quiz-board')[j].classList.add("hidden")
  j++;
  document.getElementsByClassName('quiz-board')[j].classList.remove("hidden")
  }
})
})

let submit = document.querySelectorAll(".submit")

submit.forEach(submit=>{
  submit.addEventListener("click",()=>{
  const checkboxes = document.querySelectorAll('#question-option input[type="radio"]');
  let selectedAnswers = [];

  checkboxes.forEach((checkbox)=>{
    if(checkbox.checked){
      selectedAnswers.push(checkbox.value)
    }
    submit.disabled = true;
    });

  document.getElementsByClassName('question-pallet')[j].classList.add('solved')

  console.log(selectedAnswers)
  score = 4*selectedAnswers.filter((answer)=>answer=='true').length
  console.log('score is', score)
  solved = solved + 1;
  document.getElementById('score-val').innerText = `${score}`
  console.log(solved)
  document.getElementById('quiz-completion').innerText = `${(solved/questions.value)*100}% completed`
  

  window.addEventListener("DOMContentLoaded",()=>{
  console.log('solved num of questions is- ')
})


})
})



// document.getElementById("count-val").innerText = `${questions.value}`
// document.getElementById("category-val").innerText = `${category.value}`
// let resultslide = document.getElementById("result-slide")
// document.getElementById('submit-and-leave').addEventListener('click',()=>{
//   window.location.href = "result.html"
//     console.log('outside')
//     for(let i=0;i<10;i++){
//     console.log('hello')
//     resultslide.innerHTML += `<div class="question-result">
//                 <div class="question-title">Question Name</div>
//                 <div class="final-result">Correct</div>
//                 <div class="explanation">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem, veritatis.</div> 
//                         </div>`

// }
// })




}



