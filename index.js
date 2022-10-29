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

	function _handleSquareClick(event) {
		const index = event.target.dataset.index;
		game.updateSquare(index);
	}

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
		square.addEventListener('click', _handleSquareClick);
		return square;
	}

	function _renderSquares(squares) {
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

	function init(player1, player2, activePlayer, squares) {
		_renderPlayerNames(player1.name, player2.name);
		renderScores(player1.score, player2.score);
		renderGameInfo(true);
		changeActivePlayer(activePlayer);
		_renderSquares(squares);
	}

	return {
		changeActivePlayer,
		updateSquare,
		renderGameInfo,
		renderScores,
		init,
	};
})();

const game = (() => {
	const _player1 = Player(1, 'Player1', 'X', 0);
	const _player2 = Player(2, 'Player2', 'O', 0);
	let _activePlayer = _player1;
	const _squares = Array(9).fill(null);
	let _gameOver = false;

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

	function getPlayerNumberBasedOnMarker(marker) {
		return _player1.marker === marker
			? _player1.playerNumber
			: _player2.playerNumber;
	}

	function updateSquare(index) {
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

	function init() {
		dom.init(_player1, _player2, _activePlayer, _squares);
	}

	return {
		getPlayerNumberBasedOnMarker,
		updateSquare,
		init,
	};
})();

game.init();
