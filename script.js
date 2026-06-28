let score = 0;
let tot_score = 0;
let solved = 0;
let sumbit = document.getElementById("submit")
let chosenAnswer = []
let answerKey = []
let timerID;
let timeLeft = 60;
const startQuiz = async ()=>{      
  let offset = 0;
  let limit = 50;     
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
let result = data.filter((data)=>data.category===category.value)

document.getElementsByTagName('main')[0].style.display='none';
document.getElementsByTagName('main')[1].style.display='flex';
document.getElementById('quiz-interface').style.display = 'block';
document.getElementById('info-board').style.display = 'block';

const loadQuestion = ()=>{
let quizPage = document.getElementById('quiz-page')
result.map((result,id)=>
  quizPage.innerHTML+=
  `<div class="quiz-board board hidden">
                <div class="question-info">
                    <div class="question-params">
                        <div id="${id+1}">Question ${id+1} of ${questions.value}</div>
                    </div>
                </div>
                <div class="question-panel">
                    <div id="question-slide">
                        <div class="question" id="${result.id}">${result.text}</div>
                        <div class="question-type">Multiple Answer</div>
                    </div>
                    <div class="question-feature">Click on the checkbox</div>
                    <div id="question-option">
                    
                    ${result.answers.map((answer)=>
                      `<label class="input" for="input" id="${id}">
                      <input type="radio" name="answer" id="${answer.id}" value="${answer.isCorrect}" text="${answer.text}"/><p>${answer.text}</p>
                       </label> `
                    ).join("")}
                  
                    <div id="question-browser">
                        <button class="previous">Previous</button>
                        <button class="submit">Submit</button>
                        <button class="next">Next</button>
                    </div>`
)

}
let j = 0;


const startTimer = (value)=>{
  if(value=='EASY') {timeLeft=59}
  if(value=='MEDIUM') {timeLeft=29}
  if(value=='HARD') {timeLeft=15}

    if (timeLeft > 0) {
      document.getElementById('question-timer').innerText = `00:${timeLeft}`
      timeLeft--;
      timerID = setTimeout(startTimer, 1000);
    } else {
        alert("Time's up! No option has been selected by the user");
        document.getElementsByClassName('submit')[j].disabled = true;
        solved = solved + 1;
        document.getElementsByClassName('question-pallet')[j].classList.add('solved')
    }


}

document.getElementById('count-val').innerText = `${questions.value}`
loadQuestion();
startTimer(difficulty.value);

document.getElementsByClassName('quiz-board')[j].classList.remove("hidden")

let previous = document.querySelectorAll(".previous")
previous.forEach(previous=>{
  previous.addEventListener('click',()=>{
  if(j){
  clearTimeout(timerID)
  document.getElementById('question-timer').innerText = `00:00`
  document.getElementsByClassName('quiz-board')[j].classList.add("hidden")
  j--;
  document.getElementsByClassName('quiz-board')[j].classList.remove("hidden")
  startTimer(difficulty.value)
  }
})
})

let next = document.querySelectorAll(".next")
next.forEach(next=>{
  next.addEventListener('click',()=>{
  if(j<questions.value-1){
  clearTimeout(timerID)
  if(solved<=j){
    alert('Choose and submit atleast one option to continue!')
  }else{
  document.getElementsByClassName('quiz-board')[j].classList.add("hidden")
  j++;
  document.getElementsByClassName('quiz-board')[j].classList.remove("hidden")
  startTimer(difficulty.value)
  }
}
})
})

let submit = document.querySelectorAll(".submit")

submit.forEach(submit=>{
  submit.addEventListener("click",()=>{
  clearTimeout(timerID)
  const checkboxes = document.querySelectorAll('#question-option input[type="radio"]');
  let selectedAnswers = [];

  checkboxes.forEach((checkbox,id)=>{
    if(checkbox.checked){
      selectedAnswers.push(checkbox.value)
    }
    submit.disabled = true;
    });

  document.getElementsByClassName('question-pallet')[j].classList.add('solved')
  if(selectedAnswers[0]=='true'){
    score += 4;
    answerKey.push('Correct')
  }else{
    score += 0;
    answerKey.push('Wrong')
  }
  solved = solved + 1;
  document.getElementById('score-val').innerText = `${score}`
  document.getElementById('quiz-completion').innerText = `${Math.round((solved/questions.value)*100)}% completed`
  document.getElementById('completion-progress').style.width = `${Math.round((solved/questions.value)*100)}%`
  tot_score = 4*questions.value;
})
})
  const loadResultBoard = ()=>{
    let result_dashboard = document.getElementById('result-dashboard')
    result.map((answer,id)=>{
      if(id<questions.value)
      {
        result_dashboard.innerHTML += ` <div class="question-result" id="question-${id+1}">
            <div class="question-title">Question: ${answer.text}</div>
            <div class="correct-option">Correct Key: ${(answer.answers[0].text)} </div>
            <div class="chosen-verdict">No Option Chosen</div>
            <div class="explanation">Explanation:${answer.explanation}</div>
        </div>`
      }
    })

  }


  loadResultBoard();
  document.getElementById('submit-and-leave').addEventListener('click',()=>{
    if(solved<questions.value){
      alert("YOU MUST SOLVE ALL THE QUESTIONS FIRST");
    }else{
      clearTimeout(timerID);
      onEnd();
    }
  })

const messages = (score)=>{
  if(score<=20){
    return "Try Again!"
  }
  if(score>20 && score<=50){
    return "Do Better Next Time!"
  }
  if(score>50 && score<=80){
    return "Nice Work!"
  }
  if(score>80 && score<=100){
    return "Excellent!"
  }
}

const onEnd = ()=>{
  document.getElementById('quiz-interface').style.display='none';
  document.getElementById('info-board').style.display='none';
  document.getElementById('result-dashboard').style.display = 'block';
  document.getElementById('final-score').innerHTML = `<p>SCORE: ${(score/tot_score)*100}%</p>`
  document.getElementById('celebration-message').innerHTML = `<p>${messages((score/tot_score)*100)}</p>` 
  answerKey.map((answer,id)=>{
    document.getElementsByClassName('chosen-verdict')[id].innerText = `${answerKey[id]}`
    if(answerKey[id]=='Correct'){
      document.getElementsByClassName('question-result')[id].classList.add('correct')
    }else{
      document.getElementsByClassName('question-result')[id].classList.add('wrong')
    }
    })
}


}