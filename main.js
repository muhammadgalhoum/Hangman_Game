// All Alphabet Letters 
const lettersArr = Array.from('abcdefghijklmnopqrstuvwxyz');

// Selecting letters Div
const lettersContainer = document.querySelector('.letters');

// Generating Letters 
lettersArr.forEach((letter) => {
  let span = document.createElement('span');
  span.className = 'letter-box';
  span.textContent = letter;
  lettersContainer.appendChild(span);
});

async function fetchData() {
  try {
    let myData = await fetch('./categories.json');
    let words = await myData.json();

    // Getting all Object keys (all Categories)
    const allKeys = Object.keys(words);

    const randomKeyNum = Math.floor(Math.random() * allKeys.length);
    const randomKeyName = allKeys[randomKeyNum]; // Chosen Key

    const randomKeyValue = words[randomKeyName]; // Chosen Key value

    const randomValueNum = Math.floor(Math.random() * randomKeyValue.length);
    const randomValueName = randomKeyValue[randomValueNum]; // Chosen word

    // Setting the Category name to the span element
    document.querySelector('.game-info .category > span').innerHTML = randomKeyName;

    // Selecting the Div Element which will contain the guessed letters
    const letterGuessContainer = document.querySelector('.letters-guess');

    // Converting the chosen word to an Array contains Letters and Spaces if exisit
    let chosenWordLetters = Array.from(randomValueName.toLowerCase());

    // Detecting if there is exists a space in the word or not
    let space = false;

    // Creating Spans equal to the chosen word length
    chosenWordLetters.forEach((letter) => {
      const span = document.createElement('span');
      // If the letter is a Space, We will add a specific class to this span
      if (letter === ' ') {
        space = true;
        span.className = 'space'
      }
      letterGuessContainer.appendChild(span);
    });

    // Selecting all the Spans which will contain all right guessing letters
    let spans = document.querySelectorAll('.letters-guess span');

    // Setting the number of wrong Attempts
    let wrongAttempts = 0;

    // Selecting the hangman draw div 
    let theDraw = document.querySelector('.hangman-draw');

    // Handling the Click on any Letter
    document.addEventListener('click', (e) => {
      // Everytime we set the letter status to false and if it's a right letter, it's status will change to true
      let letterStatus = false;

      if (e.target.className === 'letter-box') {
        e.target.classList.add('clicked');
        const clickedLetter = e.target.innerHTML.toLowerCase();
        chosenWordLetters.forEach((letter, letterIndex) => {
          if (letter === clickedLetter) {
            letterStatus = true; // Here the letter status will be changed to true if the letter is right letter
            spans.forEach((span, spanIndex) => {
              if (letterIndex === spanIndex) {
                span.innerHTML = letter;
              }
            });
          }
        });
        if (letterStatus !== true) {
          wrongAttempts++;

          theDraw.classList.add(`wrong-${wrongAttempts}`);
          document.getElementById('wrong').play();

          // Setting the Number of tries
          if (wrongAttempts === 7) {
            document.querySelector('.game-info .tries').innerHTML = 'Last try';
            document.querySelector('.game-info .tries').style.color = 'red';
          } else if (wrongAttempts === 8) {
            lettersContainer.classList.add('finshed');
            document.getElementById('gameover').play();
            Swal.fire({
              icon: 'error',
              title: 'Game over!',
              html: `Unfortunately, you failed after <strong>8</strong> wrong tries to guess the correct word
              which is <strong>${randomValueName}.</strong> <br> <b>Do you wanna play again?</b>`,
              showCancelButton: true,
              confirmButtonText: 'Yes',
              confirmButtonColor: '#2196f3',
            }).then((result) => {
              if (result.isConfirmed) {
                location.reload(true)
              }
          });
          } else {
            document.querySelector('.game-info .tries > span').innerHTML = `${8 - wrongAttempts}`;
          }
        } else {
          document.getElementById('success').play();
          if (wrongAttempts < 8) {
            let emptySpans = spans.length;
            spans.forEach((span) => {
              if (span.innerHTML !== '') {
                emptySpans--;
              }
            });
            if (emptySpans === 0 || (emptySpans === 1 && space === true)) {
              lettersContainer.classList.add('finshed');
              let level = wrongAttempts < 4 ? 'Excellent' : (wrongAttempts >= 4 && wrongAttempts < 7) ?
                'Intermediate' : 'Accept';
              let mistake = wrongAttempts <= 1 ? 'Mistake' : 'Mistakes';
              document.getElementById('congrats').play();
              Swal.fire({
                icon: 'success',
                title: 'Well Done!',
                html: `You made <strong>${wrongAttempts}</strong> ${mistake},\
                so your level of <strong>${randomKeyName} Info</strong> is <strong>${level}</strong> <br>\
                <b>Do you wanna play again?</b>`,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                confirmButtonColor: '#2196f3',
              }).then((result) => {
                if (result.isConfirmed) {
                  location.reload(true)
                }
              });
              document.querySelector('.confetti').style.display = 'block';
            }
          }
        }
      }
    });
  } catch (error) {
    console.log(`${error} happened!`)
  }
}

fetchData();
