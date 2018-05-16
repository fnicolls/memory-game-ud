const board = document.querySelector('.game-board');
const repeat = document.querySelector('.restart');
const moveCounter = document.querySelector('.move-count');
const timer = document.querySelector('.timer-count');
const starContainer = document.querySelector('.star-container');
const modal = document.querySelector('.modal-container');
const restart = document.querySelector('.restart');
const playAgain = document.querySelector('.game-over');
const modalStars = document.querySelector('.modal-stars');
const modalTime = document.querySelector('.modal-time');
const modalMoves = document.querySelector('.modal-moves');

let card = document.querySelectorAll('.card');
let cards = [...card];
let openCards = [];
let moves = 0;
let matches = 0;
let stars = 0;
let timeCount;


//shuffle cards
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

//start game - setup board, start timer
function startGame() {
	board.innerHTML = '';
	let newBoard = shuffle(cards);

	startTimer();

	for (let i=0; i < newBoard.length; i++) {
		board.appendChild(newBoard[i]);
	}
}

for (card of cards) {
	card.addEventListener('click', function(e){
		showCard();
		addToOpen();
	});
}

function moveCount() {
	moves++;
	moveCounter.textContent = moves;

	if (moves > 45) {
		starCount(1);
	} else if (moves > 30) {
		starCount(2);
	} else {
		starCount(3);
	}
}

function starCount(num) {
	let starIcon = '<i class="fas fa-star"></i>';

	switch (num) {
		case 3 :
			stars = 3;
			starContainer.innerHTML = starIcon + starIcon + starIcon;
			break;
		case 2 :
			stars = 2;
			starContainer.innerHTML = starIcon + starIcon;
			break;
		case 1 :
			stars = 1;
			starContainer.innerHTML = starIcon;
			break;
		default :
			break;
	}
}

function startTimer() {
	let myTime = timer.textContent;
	let ss = myTime.split(":");
	let dt = new Date();
	dt.setMinutes(ss[0]);
	dt.setSeconds(ss[1]);

	let newTime = new Date(dt.valueOf() + 1000);
	let temp = newTime.toTimeString().split(" ");
	let timeElapsed = temp[0].split(":");
	time = timeElapsed[1]+":"+timeElapsed[2];

	timer.textContent = time;
	timeCount = setTimeout(startTimer, 1000);
}

function showCard(e) {
	//add open, show classes to card
	event.target.classList.add('open', 'show');
	//add cards to openCards array
	openCards.unshift(event.target);

	moveCount();
}

function addToOpen() {
	//if 2 cards shown, check if matching
	if (openCards.length === 2) {
		let secondCard = openCards[1];
		let currentCard = openCards[0];

		//match by icon class
		if (secondCard.children.item(0).classList[1] === currentCard.children.item(0).classList[1]) {
			matchCards(secondCard, currentCard);
		} else {
			setTimeout(function() {
				secondCard.classList.add('no-match');
				currentCard.classList.add('no-match');
			}, 300);
			hideCards(secondCard, currentCard);
		}
	}
}

function matchCards(match1, match2) {
	openCards.length = 0;
	matches += 1;

	setTimeout(function() {
		match1.classList.add('matched');
		match2.classList.add('matched');
	}, 200);

	if (matches === 8) {
		endGame();
	}
}

function hideCards(card1, card2) {
	openCards.length = 0;

	setTimeout(function() {
		card1.classList.remove('open', 'show', 'no-match');
		card2.classList.remove('open', 'show', 'no-match');
	}, 700);
}

function endGame() {
	clearInterval(timeCount);
	//show modal
	modal.style.display = "block";

	//set star rating
	for (let i = 0; i < stars; i++) {
		modalStars.insertAdjacentHTML('beforeend','<i class="fas fa-star"></i>');
	}

	modalTime.textContent = 'Final Time: ' + time;
	modalMoves.textContent = 'Moves: ' + moves;
}

function resetBoard() {
	openCards.length = 0;
	moves = 0;
	matches = 0;
	clearInterval(timeCount);

	let allCards = board.allCards;

	for (let i = 0; i < allCards.length; i++) {
		allCards[i].classList.remove('open', 'show', 'match');
	}

	startGame();
}

restart.addEventListener('click', function(e){
	window.location.reload();
});

playAgain.addEventListener('click', function(e){
	e.preventDefault();
	window.location.reload();
});


startGame();
