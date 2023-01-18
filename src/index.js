import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function numToRGB(i) {
  let step = Math.max(1, 11 - Math.floor(Math.log2(i))) * 0x111111;
  return "#" + step.toString(16);
}

function Square(props) {
  return (
    <button style={{ color: numToRGB(props.value) }} className="square">
      {props.value}
    </button>
  );
}

function Board() {

  let [board, setBoard] = useState(Array(4).fill(null).map(() => Array(4).fill(null)));

  useEffect(init, []);

  function renderRow(row) {
    return (
      <div className="board-row">
        {row.map((val, idx) => renderSquare(val))}
      </div>
    );
  }

  function renderSquare(val) {
    return <Square value={val} />;
  }

  function init() {
    genNumber();
    genNumber();
    genNumber();
  }

  function moveLeft() {
    for (let i = 0; i < 4; ++i) {
      let non_zero_idx = 0;
      for (let j = 0; j < 4; ++j) {
        if (board[i][j] != 0) {
          let temp = board[i][j];
          board[i][j] = board[i][non_zero_idx];
          board[i][non_zero_idx++] = temp;
        }
      }
      let cur_merge_idx = 0;
      while (cur_merge_idx < 3 && board[i][cur_merge_idx] != 0) {
        if (board[i][cur_merge_idx] == board[i][cur_merge_idx + 1]) {
          board[i][cur_merge_idx] *= 2;
          for (let j = cur_merge_idx + 1; j < 3; ++j) {
            board[i][j] = board[i][j + 1];
          }
          board[i][3] = 0;
        }
        ++cur_merge_idx;
      }
    }
  }

  function moveRight() {
    for (let i = 0; i < 4; ++i) {
      let non_zero_idx = 3;
      for (let j = 3; j >= 0; --j) {
        if (board[i][j] != 0) {
          let temp = board[i][j];
          board[i][j] = board[i][non_zero_idx];
          board[i][non_zero_idx--] = temp;
        }
      }
      let cur_merge_idx = 3;
      while (cur_merge_idx > 0 && board[i][cur_merge_idx] != 0) {
        if (board[i][cur_merge_idx] == board[i][cur_merge_idx - 1]) {
          board[i][cur_merge_idx] *= 2;
          for (let j = cur_merge_idx - 1; j > 0; --j) {
            board[i][j] = board[i][j - 1];
          }
          board[i][0] = 0;
        }
        --cur_merge_idx;
      }
    }
  }

  function moveUp() {
    for (let j = 0; j < 4; ++j) {
      let non_zero_idx = 0;
      for (let i = 0; i < 4; ++i) {
        if (board[i][j] != 0) {
          let temp = board[i][j];
          board[i][j] = board[non_zero_idx][j];
          board[non_zero_idx++][j] = temp;
        }
      }
      let cur_merge_idx = 0;
      while (cur_merge_idx < 3 && board[cur_merge_idx][j] != 0) {
        if (board[cur_merge_idx][j] == board[cur_merge_idx + 1][j]) {
          board[cur_merge_idx][j] *= 2;
          for (let i = cur_merge_idx + 1; i < 3; ++i) {
            board[i][j] = board[i + 1][j];
          }
          board[3][j] = 0;
        }
        ++cur_merge_idx;
      }
    }
  }

  function moveDown() {
    for (let j = 0; j < 4; ++j) {
      let non_zero_idx = 3;
      for (let i = 3; i >= 0; --i) {
        if (board[i][j] != 0) {
          let temp = board[i][j];
          board[i][j] = board[non_zero_idx][j];
          board[non_zero_idx--][j] = temp;
        }
      }
      let cur_merge_idx = 3;
      while (cur_merge_idx > 0 && board[cur_merge_idx][j] != 0) {
        if (board[cur_merge_idx][j] == board[cur_merge_idx - 1][j]) {
          board[cur_merge_idx][j] *= 2;
          for (let i = cur_merge_idx - 1; i > 0; --i) {
            board[i][j] = board[i - 1][j];
          }
          board[0][j] = 0;
        }
        --cur_merge_idx;
      }
    }
  }

  function isAllNonNull() {
    return board.reduce(
      (sum, row) =>
        sum + row.reduce(
          (subSum, val) =>
            subSum + (val == null),
          0),
      0)
      == 0;
  }

  function isDedge() {
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        if (i < 3 && board[i][j] == board[i + 1][j]) {
          return false;
        }
        if (j < 3 && board[i][j] == board[i][j + 1]) {
          return false;
        }
      }
    }
    return true;
  }

  function restart() {
    alert("Dedge.");
    board = board.map(row => Array(4).fill(null));
    init();
  }

  function genNumber() {
    if (isAllNonNull()) {
      return;
    }
    while (true) {
      let i = Math.floor(Math.random() * 4);
      let j = Math.floor(Math.random() * 4);
      if (board[i][j] == null) {
        const copy = board.slice();
        copy[i][j] = 2;
        setBoard(copy);
        return;
      }
    }
  }

  const actionMap = {
    87: moveUp, 38: moveUp,
    83: moveDown, 40: moveDown,
    65: moveLeft, 37: moveLeft,
    68: moveRight, 39: moveRight,
  };

  function handleKeyDown(e) {
    if (e.keyCode in actionMap) {
      board = board.map(row => row.map(val => val ?? 0));
      actionMap[e.keyCode]();
      board = board.map(row => row.map(val => val == 0 ? null : val));
      if (isAllNonNull() && isDedge()) {
        restart();
      }
      genNumber();
    }
  }
  useEffect(() => window.onkeydown = handleKeyDown, []);

  return (
    <div>
      {board.map((row, idx) => renderRow(row))}
    </div>
  );
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <h1>The 2048.</h1>
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
