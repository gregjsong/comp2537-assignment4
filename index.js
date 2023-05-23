const levels = {
  easy: {pairs: 3, time: 100},
  medium: {pairs: 6, time: 200},
  hard: {pairs: 12, time: 300}
}

let selectedLevel = 'easy';

let pairsFound = 0;
let numClicks = 0;
let timePassed= 0;
let powerupUsed = false;

/* fetch image from poke api */
// const fetchImg = async () => {
//   let img;
//   await fetch('https://pokeapi.co/api/v2/pokemon/1/')
//     .then(response => response.json())
//     .then(data => {
//       data.results
//       img = fetch(data.sprites.other['official-artwork'].front_default);
//       console.log(img);
//     });
//   return img;
// }

const fetchImg = async (num) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${num}/`);
    const data = await response.json();
    const imgUrl = data.sprites.other['official-artwork'].front_default;
    return imgUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


/* Gets random num from range */
const getRandom = (range) => {
    return Math.floor(Math.random() * range);
}

/* Shuffles array */
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

/* creates shuffled array of pokemon img */
const createPokeArray = async (numPairs) => {
  let array = [];
  for (let i = 0; i < numPairs; i++) {
    let img = await fetchImg(getRandom(100));
    array.push(img);
    array.push(img);
    console.log(array);
  }
  return shuffleArray(array);
}

let firstCard = undefined
let secondCard = undefined

const setup = () => {
  $('.btn-group .btn').on('click', function() {
    selectedLevel = $(this).val();
    setGameGrid();
  });

  /* setup */
  // let firstCard = undefined
  // let secondCard = undefined

  $(".card").on(("click"), function clickHandler() {
    $(this).toggleClass("flip");
    updateClicks();
    if (!firstCard) {
      firstCard = $(this).find(".front_face")[0];
      // turn off click for first card
      $(`#${firstCard.id}`).parent().off("click");
    }
    else {
      // turn off all other clicks
      $(".card").off("click");
      //
      secondCard = $(this).find(".front_face")[0];
      // turn off all other clicks
      console.log(firstCard, secondCard);
      if (
        firstCard.src
        ===
        secondCard.src
      ) {
        console.log("match");
        $(`#${firstCard.id}`).parent().addClass('matched');
        $(`#${secondCard.id}`).parent().addClass('matched');
        $('.card:not(.matched)').on("click", clickHandler);
        firstCard = undefined;
        secondCard = undefined;
        updatePairs();
        setTimeout(() => {
          if (pairsFound == levels[selectedLevel].pairs) {
            alert("You win");
          };
        }, 1000);
      } else {
        console.log("no match");
        setTimeout(() => {
          // flip
          $(`#${firstCard.id}`).parent().toggleClass("flip");
          $(`#${secondCard.id}`).parent().toggleClass("flip");
          // reset
          $('.card:not(.matched)').on("click", clickHandler);
          firstCard = undefined;
          secondCard = undefined;
        }, 1000);
      }
    }
  });
}

const onStart = async () => {
  document.getElementById('game-content').classList.remove('hidden');
  document.getElementById('start-btn').classList.add('invisible');
  let grid = document.getElementById('game_grid');
  let pokeArr = await createPokeArray(levels[selectedLevel].pairs);

  let htmlContent = '';
    for (let i = 0; i < levels[selectedLevel].pairs * 2; i++) {
      console.log(pokeArr[i]);
      htmlContent += `
      <div class="card">
      <img id="img${i}"class="front_face" src="${pokeArr[i]}" alt="">
      <img class="back_face" src="./img/back.webp" alt="">
    </div>
    `
    }

  grid.innerHTML = htmlContent;
  setup();
  setupInfo();
  timer();
}

const setupInfo = () => {
  document.getElementById('total').textContent = levels[selectedLevel].pairs;

  document.getElementById('matches').textContent = pairsFound;

  document.getElementById('left').textContent = levels[selectedLevel].pairs - pairsFound;

  document.getElementById('clicks').textContent = numClicks;

  document.getElementById('timeTotal').textContent = levels[selectedLevel].time;
}

const updatePairs = () => {
  pairsFound++;
  document.getElementById('matches').textContent = pairsFound;
  document.getElementById('left').textContent = levels[selectedLevel].pairs - pairsFound;
}

const updateClicks = () => {
  numClicks++;
  document.getElementById('clicks').textContent = numClicks;
}

let powerupTimer;

const timer = () => {
  const timerInterval = setInterval(() => {
    timePassed++;
    document.getElementById('timeLeft').textContent = timePassed;
    // timePassed === 5 && !powerupUsed
    if (timePassed % 5 === 0 && timePassed !== 0) {
      powerup();
    }
    if (timePassed === levels[selectedLevel].time + 1) {
      clearInterval(timerInterval);
      alert('Gameover');
    }
  }, 1000);
};

const powerup = () => {
  powerupUsed = true;
  $('.card:not(.matched):not(.flip)').toggleClass('flip');
  powerupTimer = setTimeout(() => {
    $('.card:not(.matched).flip').toggleClass('flip');
    $(`#${firstCard.id}`).parent().toggleClass('flip');
    powerupUsed = false;
  }, 1000);
};

const handleLightBtn = () => {
  const imgElements = document.querySelectorAll('img');
  imgElements.forEach(img => {
    img.style.backgroundColor = "white";
  });
};

const handleDarkBtn = () => {
  const imgElements = document.querySelectorAll('img');
  imgElements.forEach(img => {
    img.style.backgroundColor = "black";
  });
};

const setGameGrid = () => {
  switch (selectedLevel) {
    case 'easy':
      document.getElementById('game_grid').style.width = `604px`;
      document.getElementById('game_grid').style.height = '404px'
      break;
    case 'medium':
      document.getElementById('game_grid').style.width = `804px`;
      document.getElementById('game_grid').style.height = '604px'
      break;
    case 'hard':
      document.getElementById('game_grid').style.width = `1204px`;
      document.getElementById('game_grid').style.height = '804px'
      break;
  }
}

$(document).ready(setup)