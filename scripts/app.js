window.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  const difficulty = document.getElementById('difficulty');
  const theme = document.getElementById('theme');
  const imageSrcArr = [];
  const options = {
    'theme': theme.value,
    'difficulty': difficulty.value,
  }

  // Generate images and then shuffle them
  const generateThemeImages = () => {
    // Add image src's to array. (adds two of each image).
    for (let i = 0; i < options.difficulty; i++) {
      imageSrcArr.push(`${options.theme}/${i}.svg`);
      imageSrcArr.push(`${options.theme}/${i}.svg`);
    }

    // Fisher-Yates Algorithm
    for (let i = imageSrcArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = imageSrcArr[i];
      imageSrcArr[i] = imageSrcArr[j];
      imageSrcArr[j] = temp;
    }
  };

  // Loop over images and insert card element into the DOM
  const gameboard = document.querySelector('.gameboard');

  const createBoard = () => {
    imageSrcArr.forEach(img => {
      let card = `
        <div class='card'>
          <div class='card-inner'>
            <div class='card-back'></div>
            <img class='card-front' src="./images/${img}" alt="find it's match!"/>
          </div>
        </div>
      `
      gameboard.insertAdjacentHTML("beforeend", card);
    });
  };

  const animateCard = (card) => card.classList.add('animated');
  let round = 1;
  let round1Selection;
  let round2Selection;

  const resetRound = () => {
    round = 1;
    round1Selection.classList.remove('animated');
    round2Selection.classList.remove('animated');
    round1Selection = '';
    round2Selection = '';
  }

  const roundOne = (card) => {
    round1Selection = card.currentTarget;
    animateCard(round1Selection);
    round += 1;
  }

  const roundTwo = (card) => {
    round2Selection = card.currentTarget;
    animateCard(round2Selection);
    round = 2;
    const src1 = round1Selection.querySelector('.card-front').src;
    const src2 = round2Selection.querySelector('.card-front').src;

    // Check for match
    if (src1 === src2) {
      // check if all cards have a class of animated, if so, end game, else, reset round
      round = 1;
    } else {
      setTimeout(resetRound, 2000);
    }
  }

  // Since cards are injected after form submission, add listeners after form submit
  const addCardListeners = () => {
    const cards = [...document.querySelectorAll('.card')];
    cards.forEach((card) => {
      card.addEventListener('click', (event) => {
        // if round 1, add animation, clear and store new img src for checking in round 2
        round === 1 ? roundOne(event) : roundTwo(event);
      });
    });
  }

  // Event listeners
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    generateThemeImages();
    createBoard();
    addCardListeners();
  });
});