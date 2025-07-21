const quesJSON = [
  {
    correctAnswer: 'Three ',
    options: ['Two', 'Three ', 'Four', 'Five'],
    question:
      "How many pieces of bun are in a Mcdonald's Big Mac?",
  },
  {
    correctAnswer: 'L. Frank Baum',
    options: [
      'Suzanne Collins',
      'James Fenimore Cooper',
      'L. Frank Baum',
      'Donna Leon',
    ],
    question:
      "Which author wrote 'The Wonderful Wizard of Oz'?",
  },
  {
    correctAnswer: 'Atlanta United',
    options: [
      'Atlanta United',
      'Atlanta Impact',
      'Atlanta Bulls',
      'Atlanta Stars',
    ],
    question:
      'Which of these is a soccer team based in Atlanta?',
  },
  {
    correctAnswer: 'A Nanny',
    options: [
      'A Sow',
      'A Lioness',
      'A Hen',
      'A Nanny',
    ],
    question: 'A female goat is known as what?',
  },
  {
    correctAnswer: 'P. L. Travers',
    options: [
      'J. R. R. Tolkien',
      'P. L. Travers',
      'Lewis Carroll',
      'Enid Blyton',
    ],
    question:
      "Which author wrote 'Mary Poppins'?",
  },
];

const questionObj =
{
  category: 'Food & Drink',
  id: 'qa-1',
  correctAnswer: 'Three',
  options: ['Two', 'Three ', 'Four', 'Five'],
  question:
    "How many pieces of bun are in a Mcdonald's Big Mac?",
};

let score = 0;
let currentQuestion = 0;

const questionElement = document.getElementById("question");

const optionsElement = document.getElementById("options");

const scoreElement = document.getElementById("score");


function showQuestion(){
  const { correctAnswer, options, question } = quesJSON[currentQuestion];
  questionElement.textContent = `Ques. ${question}`
  const shuffledOptions = shuffleOptions(options);

  shuffledOptions.forEach((option) => {
  let optionButton = document.createElement("button");
  optionButton.textContent = option

  optionsElement.append(optionButton);

  optionButton.addEventListener("click", (e) => {
    // if(e.target.textContent.trim() == correctAnswer.trim())
    if (option === correctAnswer) {
      score++;
      console.log("correct ans", option)
    } else {
      score -= 0.25;
      console.log("incorrect", option)
    }
    nextQuestion()
    scoreElement.textContent = `Score: ${score}`;
  })

})
}
showQuestion()

function nextQuestion(){
  currentQuestion++;
  optionsElement.textContent = '';
  if(currentQuestion>=quesJSON.length){
    questionElement.textContent = 'Quiz Completed!!';
    // optionsElement.textContent = '';
  }else{
    showQuestion()
  }
}


function shuffleOptions(options) {
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]]
  }
  return options;
}
