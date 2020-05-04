window.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  const difficulty = document.getElementById('difficulty');
  const theme = document.getElementById('theme');
  let imageSrcArr = [];
  let cards;
  let isWinner = false;
  const gameboard = document.querySelector('.gameboard');

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

  const resetGame = () => {
    round2Selection.classList.remove('fail', 'success', 'selected');
    round2Selection.classList.remove('fail', 'success', 'selected');
    round = 1;
    imageSrcArr = [];
    cards = [];
    while (gameboard.firstChild) { gameboard.removeChild(gameboard.lastChild); }
    form.classList.remove('hide');
    playAgain.classList.add('hide');
  }

  const roundOne = (card) => {
    round1Selection = card.currentTarget;
    round1Selection.classList.add('selected');
    animateCard(round1Selection);
    round += 1;
  }

  const roundTwo = (card) => {
    timeoutCardListeners();
    round2Selection = card.currentTarget;
    animateCard(round2Selection);
    round = 2;
    const src1 = round1Selection.querySelector('.card-front').src;
    const src2 = round2Selection.querySelector('.card-front').src;

    // Check for match
    if ((src1 === src2) && (!round2Selection.classList.contains('selected'))) {
      round2Selection.classList.add('success');
      round1Selection.classList.add('success');

      // Check if all cards have a class of animated
      isWinner = cards.every(x => x.classList.contains('animated') )
      if (!isWinner) { round = 1; }
      else { playAgain.classList.remove('hide'); } // end game
    } else { // failed and reset round
      round2Selection.classList.add('fail');
      round1Selection.classList.add('fail');
      setTimeout(function() {
        round2Selection.classList.remove('fail', 'selected');
        round1Selection.classList.remove('fail', 'selected');
      }, 1000);
      setTimeout(resetRound, 1000);
    }
  }

  // if round 1, add animation, clear and store new img src for checking in round 2
  const cardClickEvent = (event) => { round === 1 ? roundOne(event) : roundTwo(event); }

  // EVENT LISTENERS

  // Since cards are injected after form submission, add listeners after form submit
  const addCardListeners = (cardArr = cards) => {
    cardArr.forEach((card) => { card.addEventListener('click', cardClickEvent); });
  }

  const timeoutCardListeners = () => {
    cards.forEach((card) => { card.removeEventListener('click', cardClickEvent); });
    setTimeout(addCardListeners, 1000);
  }

  const playAgain = document.querySelector('.play-again');
  playAgain.addEventListener('click', resetGame);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    generateThemeImages();
    createBoard();
    cards = [...document.querySelectorAll('.card')];
    addCardListeners(cards);
    form.classList.add('hide');
    if (!playAgain.classList.contains('hide')) { playAgain.classList.add('hide'); }
  });
});