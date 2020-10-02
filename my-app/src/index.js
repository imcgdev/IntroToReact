import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const rows = Array.from(Array(3), (e, row) => {
      const squares = Array.from(Array(3), (f, col) =>
        this.renderSquare(row * 3 + col)
      );

      return (
        <div key={row} className="board-row">
          {squares}
        </div>
      );
    });

    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{ squares: Array(9).fill(null), row: null, col: null }],
      xIsNext: true,
      stepNumber: 0,
      moveOrderAscending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: history.concat([
        {
          squares: squares,
          row: Math.floor(i / 3),
          col: i % 3,
        },
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  toggleMoveOrder() {
    this.setState({
      moveOrderAscending: !this.state.moveOrderAscending,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    let moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" + move + " (" + step.row + ", " + step.col + ")"
        : "Go to game start";

      const style =
        move === this.state.stepNumber
          ? { fontWeight: "bold" }
          : { fontWeight: "normal" };

      return (
        <li key={move}>
          {" "}
          <button style={style} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>{" "}
        </li>
      );
    });

    if (!this.state.moveOrderAscending) {
      moves = moves.reverse();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>
            {status}
            <button onClick={() => this.toggleMoveOrder()}>
              Reverse Order
            </button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
