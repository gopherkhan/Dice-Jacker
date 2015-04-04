//dice-jacker

window.DiceJacker = function() {
//<div class="dice">
	var gameArea, currentRollDisplay, rollTargetDisplay, 
		rollTarget, playerRollDisplay, computerRollDisplay,
		winBox;
	var playerRollHistory = [];
	var computerRollHistory = [];
	// access dice face by index. e.g., dice_templates[1] = side 1, dice_templates[6] = side 6
	var dice_templates = ['',
				'<div class="dice-face one">\
					<div class="dice-row"></div>\
					<div class="dice-row"><div class="dot"></div></div>\
					<div class="dice-row"></div>\
				</div>',
				'<div class="dice-face two">\
					<div class="dice-row"><div class="dot left"></div></div>\
					<div class="dice-row"></div>\
					<div class="dice-row"><div class="dot right"></div></div>\
				</div>',
				'<div class="dice-face three">\
					<div class="dice-row"><div class="dot left"></div></div>\
					<div class="dice-row"><div class="dot"></div></div>\
					<div class="dice-row"><div class="dot right"></div></div>\
				</div>',
				'<div class="dice-face four">\
					<div class="dice-row"><div class="dot left"></div><div class="dot right"></div></div>\
					<div class="dice-row"></div>\
					<div class="dice-row"><div class="dot left"></div><div class="dot right"></div></div>\
				</div>',
				'<div class="dice-face five">\
					<div class="dice-row"><div class="dot left"></div><div class="dot right"></div></div>\
					<div class="dice-row"><div class="dot"></div></div>\
					<div class="dice-row"><div class="dot left"></div><div class="dot right"></div></div>\
				</div>',
				'<div class="dice-face six">\
					<div class="dice-row"><div class="dot left"></div><div class="dot right"></div></div>\
					<div class="dice-row"><div class="dot left"></div><div class="dot right"></div></div>\
					<div class="dice-row"><div class="dot left"></div><div class="dot right"></div></div>\
				</div>'];

	function _getRandom() {
		return Math.floor(Math.random() * (dice_templates.length - 1)) + 1;
	}

	function getPlayerTotal() {
		return playerRollHistory.length ? playerRollHistory.reduce(function(a, b) {
										  return a + b;
										}) : 0;
	}

	function getComputerTotal() {
		return computerRollHistory.length ? computerRollHistory.reduce(function(a, b) {
										  return a + b;
										}) : 0;	
	}

	function computerRoll() {
		var computerTotal = getComputerTotal();
		if (rollTarget - computerTotal < _getRandom()) {
			endGame();
			return;
		}

		var die1  = _getRandom();
		var die2 = _getRandom();

		computerRollHistory.push(die1 + die2);
		currentRollDisplay.innerHTML = dice_templates[die1] + dice_templates[die2];
		computerRollDisplay.innerText = "Total: " + getComputerTotal() + " [ " + computerRollHistory.join(",") + "]";


		setTimeout(computerRoll, 500);
	}

	function endGame() {
		var computerTotal = getComputerTotal();
		var playerTotal = getPlayerTotal();
		if (computerTotal > rollTarget) {
			displayComputerBust();
		} else if (computerTotal > playerTotal) {
			displayComputerWin()
		} else {
			displayPlayerWin();
		}
	}

	function displayComputerWin() {
		displayWinScreen("Computer Wins!", "You're way too green to play against this machine!")
	}

	function displayComputerBust() {
		displayWinScreen("Epic WINNNNN!","Stupid computer busted. You're so smart!");
	}

	function displayPlayerBust() {
		displayWinScreen("OUCH!!! You busted", "OMG! You are such a failure!");
	}

	function displayPlayerWin() {
		displayWinScreen("Epic WINNNNN!","So ballin', you don't even know!");
	}



	function roll() {
		var die1  = _getRandom();
		var die2 = _getRandom();

		playerRollHistory.push(die1 + die2);
		currentRollDisplay.innerHTML = dice_templates[die1] + dice_templates[die2];

		playerRollDisplay.innerText = "Total: " + getPlayerTotal() + " [ " + playerRollHistory.join(",") + "]";  
		
		checkStatus();
	}

	function stay() {
		computerRoll();
	}

	function displayWinScreen(title, description) {
		var winTitle = winBox.querySelector('.title');
		var winDesc = winBox.querySelector('.description');
		winTitle.innerText = title;
		winDesc.innerText = description;
		winBox.classList.toggle("hidden"); 
	}

	function checkStatus() {
		var playerTotal = getPlayerTotal(); 
		
		if (playerTotal > rollTarget) { 
			displayPlayerBust(); 
		}
		if (playerTotal == rollTarget) { 
			displayPlayerWin(); 
		}
	}

	function start() {
		rollTarget = 0;
		playerRollHistory.length = 0;
		computerRollHistory.length = 0;
		currentRollDisplay.innerHTML = playerRollDisplay.innerHTML = computerRollHistory.innerHTML = "";
		
		var iterations = Math.floor(Math.random() * 15);
		for (var i = 0; i  < iterations; ++i) {
			rollTarget += _getRandom();
		}
		rollTargetDisplay.innerText = "Target: " + rollTarget;
		gameArea.querySelector('.pre-game').classList.toggle('hidden');
		gameArea.querySelector('.game-on').classList.toggle('hidden');
	}

	function init(target) {
		gameArea = document.querySelector(target);
		currentRollDisplay = gameArea.querySelector('.current-roll');
		rollTargetDisplay = gameArea.querySelector('.roll-target');
		gameArea.querySelector('.start-button').addEventListener('click', start);
		gameArea.querySelector('.hit-button').addEventListener('click', roll);
		gameArea.querySelector('.stay-button').addEventListener('click', stay);
		playerRollDisplay = gameArea.querySelector('.player-rolls');
		computerRollDisplay = gameArea.querySelector('.computer-rolls');
		winBox = gameArea.querySelector('.win-box');
		gameArea.querySelector('.again-button').addEventListener('click', playAgain);

		//.innerHTML = dice_templates.join("");
	}

	function playAgain() {
		winBox.classList.toggle('hidden');
		start();
	}

	return {
		init: init
	}

}()