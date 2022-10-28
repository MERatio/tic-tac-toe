'use strict';

const game = (() => {
	const _squares = Array(9).fill(null);

	// For testing purposes only.
	_squares[0] = 'X';
	_squares[1] = 'O';
	_squares[4] = 'X';
	_squares[8] = 'O';

	function init() {
		display.renderSquares(_squares);
	}

	return {
		init,
	};
})();

const display = (() => {
	const _domSquares = document.querySelector('.js-squares');

	function _getDomSquare(square) {
		const domSquare = document.createElement('button');
		domSquare.classList.add('square');
		if (square) {
			domSquare.classList.add(square);
		}
		domSquare.textContent = square;

		return domSquare;
	}

	function renderSquares(squares) {
		for (const square of squares) {
			const domSquare = _getDomSquare(square);
			_domSquares.appendChild(domSquare);
		}
	}

	return { renderSquares };
})();

game.init();
