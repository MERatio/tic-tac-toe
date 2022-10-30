'use strict';

function Player(playerNumber, name, marker, score) {
	return {
		playerNumber,
		name,
		marker,
		score,
	};
}

const dom = (() => {
	const _modeSelect = document.querySelector('.js-select-mode');
	const _player1Name = document.querySelector('.js-player1-name');
	const _player2Name = document.querySelector('.js-player2-name');
	const _player1Score = document.querySelector('.js-player1-score');
	const _player2Score = document.querySelector('.js-player2-score');
	const _player1NameAndScoreContainer = document.querySelector(
		'.js-player1-name-and-score-container'
	);
	const _player2NameAndScoreContainer = document.querySelector(
		'.js-player2-name-and-score-container'
	);
	const _gameInfo = document.querySelector('.js-game-info');
	let _activeMarker;
	const _squares = document.querySelector('.js-squares');
	const _restartGameBtn = document.querySelector('.js-restart-game-btn');

	function _getSquareClassList(marker) {
		let classes = 'square';
		if (marker) {
			const playerNumber = game.getPlayerNumberBasedOnMarker(marker);
			classes += ` player${playerNumber}-marker`;
		}
		return classes;
	}

	function _getSquare(marker, index) {
		const square = document.createElement('button');
		square.classList = _getSquareClassList(marker);
		square.textContent = marker;
		square.dataset.index = index;
		square.addEventListener('click', game.handleSquareClick);
		return square;
	}

	function _clearSquares() {
		while (_squares.firstChild) {
			_squares.firstChild.removeEventListener('click', game.handleSquareClick);
			_squares.removeChild(_squares.firstChild);
		}
	}

	function _renderSquares(squares) {
		_clearSquares();

		for (let i = 0; i < squares.length; i++) {
			const square = _getSquare(squares[i], i);
			_squares.appendChild(square);
		}
	}

	function _renderPlayerNames(player1Name, player2Name) {
		_player1Name.textContent = player1Name;
		_player2Name.textContent = player2Name;
	}

	function changeActivePlayer(activePlayer) {
		if (activePlayer.playerNumber === 1) {
			_player2NameAndScoreContainer.classList.remove('active');
			_player1NameAndScoreContainer.classList.add('active');
		} else {
			_player1NameAndScoreContainer.classList.remove('active');
			_player2NameAndScoreContainer.classList.add('active');
		}
		_activeMarker.textContent = activePlayer.marker;
	}

	function updateSquare(index, marker) {
		const square = _squares.children[index];
		square.textContent = marker;
		square.classList = _getSquareClassList(marker);
	}

	function renderGameInfo(initialContent, text = '') {
		if (initialContent) {
			_gameInfo.innerHTML = '';

			const span = document.createElement('span');
			span.classList.add('fw-700', 'js-active-marker');
			_gameInfo.appendChild(span);

			const textNode = document.createTextNode(' turn');
			_gameInfo.appendChild(textNode);

			_activeMarker = document.querySelector('.js-active-marker');
		} else {
			_gameInfo.textContent = text;
		}
	}

	function renderScores(player1Score, player2Score) {
		_player1Score.textContent = player1Score;
		_player2Score.textContent = player2Score;
	}

	function restart(activePlayer, squares) {
		renderGameInfo(true);
		changeActivePlayer(activePlayer);
		_renderSquares(squares);
	}

	function init(player1, player2, activePlayer, squares) {
		_modeSelect.addEventListener('change', game.handleSelectModeChange);
		_renderPlayerNames(player1.name, player2.name);
		renderScores(player1.score, player2.score);
		renderGameInfo(true);
		changeActivePlayer(activePlayer);
		_renderSquares(squares);
		_restartGameBtn.addEventListener('click', game.restart);
	}

	return {
		changeActivePlayer,
		updateSquare,
		renderGameInfo,
		renderScores,
		restart,
		init,
	};
})();

const game = (() => {
	let _mode = 'vs-player';
	let _player1;
	let _player2;
	let _activePlayer;
	let _squares;
	let _isComputerMakingAMove;
	let _computerMoveTimeoutId;
	let _gameOver;

	function _changeActivePlayer() {
		_activePlayer = _activePlayer === _player1 ? _player2 : _player1;
		dom.changeActivePlayer(_activePlayer);
	}

	function _checkWinner(squares) {
		const winningLines = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];
		for (const winningLine of winningLines) {
			if (
				squares[winningLine[0]] &&
				squares[winningLine[0]] === squares[winningLine[1]] &&
				squares[winningLine[0]] === squares[winningLine[2]]
			) {
				return 'yes';
			}
		}

		const isAllSquaresTaken = squares.every((square) => square !== null);
		if (isAllSquaresTaken) {
			return 'tie';
		}

		return 'no one yet';
	}

	function _updateSquare(index) {
		if (_squares[index] || _gameOver) {
			return;
		}

		_squares[index] = _activePlayer.marker;
		dom.updateSquare(index, _activePlayer.marker);

		const isThereAWinner = _checkWinner(_squares);
		switch (isThereAWinner) {
			case 'yes':
				_activePlayer.score++;
				dom.renderScores(_player1.score, _player2.score);
				dom.renderGameInfo(false, `${_activePlayer.name} wins!`);
				_gameOver = true;
				break;
			case 'tie':
				dom.renderGameInfo(false, `It's a tie!`);
				_gameOver = true;
				break;
			default:
				_changeActivePlayer();
		}
	}

	function _makeComputerMove(difficulty) {
		_isComputerMakingAMove = true;

		let index;

		switch (difficulty) {
			case 'easy':
				while (_squares[index] !== null) {
					index = Math.floor(Math.random() * _squares.length + 1);
				}
				break;
		}

		_computerMoveTimeoutId = setTimeout(() => {
			_updateSquare(index);
			_isComputerMakingAMove = false;
		}, 500);
	}

	function getPlayerNumberBasedOnMarker(marker) {
		return _player1.marker === marker
			? _player1.playerNumber
			: _player2.playerNumber;
	}

	function handleSquareClick(event) {
		const index = event.target.dataset.index;
		if (_squares[index] || _isComputerMakingAMove) {
			return;
		}
		_updateSquare(index);
		if (!_gameOver) {
			if (_mode === 'vs-computer-easy') {
				_makeComputerMove('easy');
			}
		}
	}

	function handleSelectModeChange(event) {
		_mode = event.target.value;
		init();
	}

	function restart() {
		_activePlayer = _player1;
		_squares = Array(9).fill(null);
		_isComputerMakingAMove = false;
		clearTimeout(_computerMoveTimeoutId);
		_computerMoveTimeoutId = undefined;
		_gameOver = false;
		dom.restart(_activePlayer, _squares);
	}

	function init() {
		const player1Name = prompt('Player1 name?', '') || 'Player1';
		_player1 = Player(1, player1Name, 'X', 0);
		switch (_mode) {
			case 'vs-player':
				const player2Name = prompt('Player2 name?', '') || 'Player2';
				_player2 = Player(2, player2Name, 'O', 0);
				break;
			case 'vs-computer-easy':
				_player2 = Player(2, 'Computer (easy)', 'O', 0);
				break;
		}
		_activePlayer = _player1;
		_squares = Array(9).fill(null);
		_isComputerMakingAMove = false;
		clearTimeout(_computerMoveTimeoutId);
		_computerMoveTimeoutId = undefined;
		_gameOver = false;
		dom.init(_player1, _player2, _activePlayer, _squares);
	}

	return {
		getPlayerNumberBasedOnMarker,
		handleSquareClick,
		handleSelectModeChange,
		restart,
		init,
	};
})();

game.init();
