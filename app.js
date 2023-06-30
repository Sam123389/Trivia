const baseURL = 'https://opentdb.com/api.php?amount=10';
const categorySelect = document.querySelector('.Category');
let score = 0;
function resetScore() {
  score = 0;
  updateScore();
}

async function getCategories() {
  try {
    const response = await fetch('https://opentdb.com/api_category.php');
    const data = await response.json();
    return data.trivia_categories;
  } catch (error) {
    console.log('Error al obtener las categorías:', error);
  }
}

function displayCategories(categories) {
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}

getCategories().then((categories) => {
  displayCategories(categories);
});

function createTrivia() {
  resetScore();
  const difficultySelect = document.querySelector('.Difficulty');
  const typeSelect = document.querySelector('.Type');
  const categorySelect = document.querySelector('.Category');

  const difficulty = difficultySelect.value;
  const type = typeSelect.value;
  const category = categorySelect.value;

  const url = `${baseURL}&difficulty=${difficulty}&type=${type}&category=${category}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const questions = data.results;
      console.log(questions);
      displayTrivia(questions);
    })
    .catch((error) => {
      console.log('Error al obtener las preguntas:', error);
    });
}

function displayTrivia(questions) {
  const triviaContainer = document.getElementById('triviaContainer');
  triviaContainer.innerHTML = '';

  questions.forEach((question, index) => {
    const questionElement = document.createElement('p');
    questionElement.textContent = `Question ${index + 1}: ${decodeEntities(question.question)}`;

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');

    const allOptions = question.incorrect_answers.concat(question.correct_answer);
    const shuffledOptions = shuffle(allOptions);

    shuffledOptions.forEach((option) => {
      const optionElement = document.createElement('button');
      optionElement.textContent = option;
      optionsContainer.appendChild(optionElement);

      optionElement.addEventListener('click', () => {
        if (option === question.correct_answer) {
          score += 100;
          alert('The answer is correct! Congratulations!!');
        }else {
          alert('The answer is incorrect!');
        }
        updateScore();
      });
    });

    triviaContainer.appendChild(questionElement);
    triviaContainer.appendChild(optionsContainer);
  });

  updateScore();
}

function updateScore() {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = `Score: ${score}`;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function decodeEntities(encodedString) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = encodedString;
  return textArea.value;
}