window.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  const difficulty = document.getElementById('difficulty');
  const theme = document.getElementById('theme');
  const imageSrcArr = [];

  const options = {
    'theme': theme.value,
    'difficulty': difficulty.value,
  }

  const generateThemeImages = () => {
    // Add image src's to array. (adds two of each image).
    for (let i = 0; i < options.difficulty; i++) {
      imageSrcArr.push(`${options.theme}/${i}.svg`);
      imageSrcArr.push(`${options.theme}/${i}.svg`);
    }

    // Shuffle the images | Fisher-Yates Algorithm
    for (let i = imageSrcArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = imageSrcArr[i];
      imageSrcArr[i] = imageSrcArr[j];
      imageSrcArr[j] = temp;
    }
  };

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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    generateThemeImages();
    createBoard();
  });

});