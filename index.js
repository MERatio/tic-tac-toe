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
	const _activeMarker = document.querySelector('.js-active-marker');
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

	function _renderScores(player1Score, player2Score) {
		_player1Score.textContent = player1Score;
		_player2Score.textContent = player2Score;
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

	function init(player1, player2, activePlayer, squares) {
		_renderPlayerNames(player1.name, player2.name);
		_renderScores(player1.score, player2.score);
		changeActivePlayer(activePlayer);
		_renderSquares(squares);
	}

	return { changeActivePlayer, updateSquare, init };
})();

const game = (() => {
	const _player1 = Player(1, 'Player1', 'X', 0);
	const _player2 = Player(2, 'Player2', 'O', 0);
	let _activePlayer = _player1;
	const _squares = Array(9).fill(null);

	function _changeActivePlayer() {
		_activePlayer = _activePlayer === _player1 ? _player2 : _player1;
		dom.changeActivePlayer(_activePlayer);
	}

	function getPlayerNumberBasedOnMarker(marker) {
		return _player1.marker === marker
			? _player1.playerNumber
			: _player2.playerNumber;
	}

	function updateSquare(index) {
		if (_squares[index]) {
			return;
		}
		_squares[index] = _activePlayer.marker;
		dom.updateSquare(index, _activePlayer.marker);
		_changeActivePlayer();
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
