'use strict';

function Player(marker) {
	return {
		marker,
	};
}

const game = (() => {
	const _squares = Array(9).fill(null);
	const _xPlayer = Player('X');
	const _oPlayer = Player('O');
	let _activePlayer = _xPlayer;

	function _changeActivePlayer() {
		_activePlayer = _activePlayer === _xPlayer ? _oPlayer : _xPlayer;
	}

	function isSquareTaken(index) {
		return !!_squares[index];
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
		updateSquare,
		init,
	};
})();

const display = (() => {
	const _domSquares = document.querySelector('.js-squares');

	function _handleSquareClick(event) {
		const index = event.target.dataset.index;
		if (game.isSquareTaken(index)) {
			return;
		}
		game.updateSquare(index);
	}

	function _getDomSquare(square, index) {
		const domSquare = document.createElement('button');
		domSquare.classList.add('square');
		if (square) {
			domSquare.classList.add(square);
		}
		domSquare.textContent = square;
		domSquare.dataset.index = index;
		domSquare.addEventListener('click', _handleSquareClick);
		return domSquare;
	}

	function updateSquare(index, marker) {
		const domSquare = _domSquares.children[index];
		domSquare.textContent = marker;
		domSquare.classList.add(marker);
	}

	function renderSquares(squares) {
		for (let i = 0; i < squares.length; i++) {
			const domSquare = _getDomSquare(squares[i], i);
			_domSquares.appendChild(domSquare);
		}
	}

	return { updateSquare, renderSquares };
})();

game.init();
