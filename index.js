'use strict';

const ticTacToe = (() => {
	function createPlayer(name, marker) {
		return { name, marker };
	}

	const gameBoard = (() => {
		let board;

		function createBoard(rows, columns) {
			const board = [];
			for (let i = 0; i < rows; i++) {
				board.push([]);
				for (let j = 0; j < columns; j++) {
					board[i].push(null);
				}
			}
			return board;
		}

		function resetBoard() {
			board = createBoard(3, 3);
		}

		function getBoard() {
			return board.slice();
		}

		function mark(row, column, marker) {
			const cell = board[row][column];
			if (cell === undefined) {
				return 1;
			} else if (cell) {
				return 2;
			} else if (cell === null) {
				board[row][column] = marker;
				return 0;
			}
		}

		return { resetBoard, getBoard, mark };
	})();

	const displayController = (() => {
		const containerDiv = document.getElementById('container');
		const announcementText = document.getElementById('announcementText');
		const restartBtn = document.getElementById('restartBtn');
		const boardMain = document.getElementById('board');

		function handleRestartBtnClick() {
			gameController.init();
		}

		function handleCellBtnClick(e) {
			const { row, column } = e.currentTarget.dataset;
			gameController.playRound(row, column);
		}

		function clearBoardMain() {
			const cellBtns = Array.from(boardMain.children);
			for (const cellBtn of cellBtns) {
				cellBtn.removeEventListener('click', handleCellBtnClick);
				cellBtn.remove();
			}
		}

		function renderBoard(board) {
			clearBoardMain();
			for (let i = 0; i < board.length; i++) {
				for (let j = 0; j < board[i].length; j++) {
					const cell = board[i][j];
					const cellBtn = document.createElement('button');
					cellBtn.setAttribute('type', 'button');
					cellBtn.classList.add('cell');
					if (cell) {
						cellBtn.disabled = true;
						cellBtn.textContent = cell;
						if (cell === 'X') {
							cellBtn.classList.add('color-black');
						} else {
							cellBtn.classList.add('color-cloud');
						}
					} else {
						cellBtn.classList.add('cursor-pointer');
						cellBtn.dataset.row = i;
						cellBtn.dataset.column = j;
						cellBtn.textContent = '';
						cellBtn.addEventListener('click', handleCellBtnClick);
					}
					boardMain.appendChild(cellBtn);
				}
			}
		}

		function announceActivePlayerText(activePlayer) {
			announcementText.textContent = `${activePlayer.name} (${activePlayer.marker})'s  turn.`;
		}

		function announceText(str) {
			announcementText.textContent = str;
		}

		restartBtn.addEventListener('click', handleRestartBtnClick);

		return {
			renderBoard,
			announceActivePlayerText,
			announceText,
		};
	})();

	const gameController = (() => {
		let gameOver;
		let player1;
		let player2;
		let activePlayer;

		function areAllCellsOccupied(board) {
			for (const row of board) {
				for (const cell of row) {
					if (!cell) {
						return false;
					}
				}
			}
			return true;
		}

		function getWhoseMarker(marker) {
			return player1.marker === marker ? player1 : player2;
		}

		function getWinner(board) {
			const lines = [
				// Rows
				[
					[0, 0],
					[0, 1],
					[0, 2],
				],
				[
					[1, 0],
					[1, 1],
					[1, 2],
				],
				[
					[2, 0],
					[2, 1],
					[2, 2],
				],
				// Columns
				[
					[0, 0],
					[1, 0],
					[2, 0],
				],
				[
					[0, 1],
					[1, 1],
					[2, 1],
				],
				[
					[0, 2],
					[1, 2],
					[2, 2],
				],
				// Diagonals
				[
					[0, 0],
					[1, 1],
					[2, 2],
				],
				[
					[2, 0],
					[1, 1],
					[0, 2],
				],
			];
			for (const line of lines) {
				const [a, b, c] = line;
				const [aX, aY] = a;
				const [bX, bY] = b;
				const [cX, cY] = c;
				if (
					board[aX][aY] &&
					board[aX][aY] === board[bX][bY] &&
					board[bX][bY] === board[cX][cY]
				) {
					return getWhoseMarker(board[aX][aY]);
				}
			}

			if (areAllCellsOccupied(board)) {
				return 'Tie';
			} else {
				return null;
			}
		}

		function switchActivePlayer() {
			activePlayer = activePlayer === player1 ? player2 : player1;
		}

		function playRound(row, column) {
			if (gameOver) {
				return;
			}

			const markResult = gameBoard.mark(row, column, activePlayer.marker);
			if (markResult === 1) {
				displayController.announceText('Out of bounds.');
			} else if (markResult === 2) {
				displayController.announceText('Cell is already taken.');
			} else {
				const board = gameBoard.getBoard();
				const winner = getWinner(board);
				displayController.renderBoard(board);
				if (winner === null) {
					switchActivePlayer();
					displayController.announceActivePlayerText(activePlayer);
				} else if (winner === 'Tie') {
					gameOver = true;
					displayController.announceText("It's a tie!");
				} else {
					gameOver = true;
					displayController.announceText(
						`The winner is ${winner.name} (${winner.marker})!`,
					);
				}
			}
		}

		function init() {
			gameBoard.resetBoard();
			gameOver = false;
			player1 = createPlayer('Player 1', 'X');
			player2 = createPlayer('Player 2', 'O');
			activePlayer = player1;
			const board = gameBoard.getBoard();
			displayController.renderBoard(board);
			displayController.announceActivePlayerText(activePlayer);
		}

		return { playRound, init };
	})();

	gameController.init();
})();
