'use strict';

function Player(playerNumber, marker) {
	return {
		playerNumber,
		marker,
	};
}

const display = (() => {
	const _player1NameAndScoreContainer = document.querySelector(
		'.js-player1-name-and-score-container'
	);
	const _player2NameAndScoreContainer = document.querySelector(
		'.js-player2-name-and-score-container'
	);
	const _activeMarker = document.querySelector('.js-active-marker');
	const _domSquares = document.querySelector('.js-squares');

	function _handleSquareClick(event) {
		const index = event.target.dataset.index;
		if (game.isSquareTaken(index)) {
			return;
		}
		game.updateSquare(index);
	}

	function _getDomSquareClassList(square) {
		let classes = 'square';
		if (square) {
			const playerNumber = game.getPlayerNumberBasedOnMarker(square);
			classes += ` player${playerNumber}-marker`;
		}
		return classes;
	}

	function _getDomSquare(square, index) {
		const domSquare = document.createElement('button');
		domSquare.classList = _getDomSquareClassList(square);
		domSquare.textContent = square;
		domSquare.dataset.index = index;
		domSquare.addEventListener('click', _handleSquareClick);
		return domSquare;
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
		const domSquare = _domSquares.children[index];
		domSquare.textContent = marker;
		domSquare.classList = _getDomSquareClassList(marker);
	}

	function renderSquares(squares) {
		for (let i = 0; i < squares.length; i++) {
			const domSquare = _getDomSquare(squares[i], i);
			_domSquares.appendChild(domSquare);
		}
	}

	return { changeActivePlayer, updateSquare, renderSquares };
})();

const game = (() => {
	const _squares = Array(9).fill(null);

	const _player1 = Player(1, 'X');
	const _player2 = Player(2, 'O');
	let _activePlayer = _player1;

	function _changeActivePlayer() {
		_activePlayer = _activePlayer === _player1 ? _player2 : _player1;
		display.changeActivePlayer(_activePlayer);
	}

	function isSquareTaken(index) {
		return !!_squares[index];
	}

	function getPlayerNumberBasedOnMarker(marker) {
		return _player1.marker === marker
			? _player1.playerNumber
			: _player2.playerNumber;
	}

	function updateSquare(index) {
		_squares[index] = _activePlayer.marker;
		display.updateSquare(index, _activePlayer.marker);
		_changeActivePlayer();
	}

	function init() {
		display.renderSquares(_squares);
	}

	return {
		isSquareTaken,
		getPlayerNumberBasedOnMarker,
		updateSquare,
		init,
	};
})();

game.init();
