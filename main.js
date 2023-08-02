let questionDiv     = document.querySelector('.quiz-area .question-div h2');
let answersDiv      = document.querySelector('.answers-div');
let questionsCount  = document.querySelector('.questionsnumber span');
let bulletsSpan     = document.querySelector('.spans'); 
let submit          = document.querySelector('.submit');
let minutes         = document.querySelector('.minutes');
let seconds         = document.querySelector('.seconds');
let answers = 0 ; 
let index = 0 ; 
let duration = 5; 
let counter ; 
let useranswer;
function getData(){
    let request  = new XMLHttpRequest(); 
    request.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            let mainArray = JSON.parse(this.responseText);
            showDataInTemplate(mainArray);
            createBullets(mainArray.length);
            let numOfQuestions = mainArray.length;
            questionsCount.innerHTML =numOfQuestions;
            submit.onclick  = function(){
                numOfQuestions--; 
                questionsCount.innerHTML  = numOfQuestions; 
                if(index < mainArray.length){
                    checkAnswer(useranswer, mainArray);
                    index++;
                    if(index == mainArray.length){
                        questionDiv.innerHTML = '';
                        answersDiv.innerHTML = '';
                        let result = document.createElement('h1');
                        result.appendChild(document.createTextNode(`you got ${answers} from ${mainArray.length}`));
                        result.className = 'result';
                        answersDiv.appendChild(result);
                        let tryQuestion = document.createElement('div');
                        tryQuestion.innerText  = 'would you like to Try Again ? ' ; 
                        document.querySelector('.submit-btn').appendChild(tryQuestion); 
                        submit.className = 'try';
                        submit.textContent = 'try again';
                        tryQuestion.className = 'tryQ';
                        submit.onclick = restart;
                    }
                    showDataInTemplate(mainArray);
                    createBullets(mainArray.length);
                    clearInterval(counter);
                    countDown(duration, mainArray.length); 

                }
  
            }

        }
    }
    request.open('GET', 'main.json', true);
    request.send(); 
}
getData();
countDown(duration, 9   );
function showDataInTemplate(mainArray){

         if(index < mainArray.length){

            questionDiv.innerHTML = '';
            questionDiv.appendChild(document.createTextNode(mainArray[index].title)); 
            answersDiv.innerHTML  = '';  
            for(let i = 1; i <= 4; i++){
                let div            = document.createElement('li');
                div.className      = 'answer';
                div.id             = `${i}`;
                div.dataset.answer = mainArray[index][`answer_${i}`]
                div.appendChild(document.createTextNode( mainArray[index][`answer_${i}`]));
                answersDiv.appendChild(div);
            }

         }  


}
answersDiv.addEventListener('click', (element)=>{
    let id = element.target.id; 
    let arrayOfAnswers = document.querySelectorAll('.answers-div .answer')
    selectAnswer(id, arrayOfAnswers);

})

function selectAnswer(id, arrayOfAnswers){
    for(let i = 0 ; i < arrayOfAnswers.length ; i++){
        if(arrayOfAnswers[i].id !== id){
            arrayOfAnswers[i].className  = 'answer';
        }else{
            arrayOfAnswers[i].className  = 'answer selected';
            useranswer =  arrayOfAnswers[i].dataset.answer;

        }
    }
}

function createBullets(count){
    bulletsSpan.innerHTML = '';
    for(let i = 0 ; i < count; i++){
        let bullet = document.createElement('span');
        if( i  <=  index){
            bullet.className = 'active';
        }
        bulletsSpan.appendChild(bullet);
    }
}

function checkAnswer(useranswer, mainArray){
    let rightAnswer = mainArray[index].right_answer;
    if(useranswer == rightAnswer){
        answers++;
    }
}


function restart(){
    location.reload();
}

function countDown(duration, count){
    if(index < count){
        let minute  , second ; 
        counter = setInterval(function(){
        minute = parseInt(duration / 60);
        second = parseInt(duration % 60);

        if(minute < 10){
            minute = `0${minute}`
        }
        if(second < 10 ){
            second = `0${second}`
        }

        minutes.innerHTML = minute ; 
        seconds.innerHTML = second ; 

        if(--duration < 0 ){
            clearInterval(counter);
            submit.click(); 
        }

        }, 1000);

    }
}
