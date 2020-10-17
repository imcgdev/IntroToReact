import React from "react";
import Square from "./square";

export default class Board extends React.Component {
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
