import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
class Square extends React.Component {    
    render() {
      return (
        <button
          className="square"
          onClick = {() => this.props.onClick()}>
          {this.props.value}
        </button>
      );
    }
  }
*/
function Square(props) {
  return (
    <button className="square"
      onClick = {() => props.onClick()}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} />
    );
  }
  
  render() {
    const size = 3;
    return (
      <div>
        {/*Challenge 3*/}
        {Array.from({length: size}, (_, row) => 
          <div className="board-row">
          {Array.from({length: size}, (_, col) => 
            this.renderSquare(size*row+col)
          )}
          </div>
        )}
        {/*Challenge 3*/}
      </div>
    );
  }
}

class Game extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        index: Array(9).fill(null)/*Challenge 1*/
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const index = current.index.slice();/*Challenge 1*/

    if(calculateWinner(squares) || squares[i]) {
      return;
    }

    const {xIsNext} = this.state;
    squares[i] = xIsNext ? 'X' : 'O';
    index[history.length-1] = i;/*Challenge 1*/

    this.setState({
      history: history.concat([{
        squares: squares,
        index: index,/*Challenge 1*/
      }]),
      stepNumber: history.length,
      xIsNext: !xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const {history} = this.state;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      /*Challenge 1*/
      const desc = move ?
        'Go to move $' + move 
          + ' (' + (step.index[move-1]%3+1) + ',' 
          + (parseInt(step.index[move-1]/3)+1) + ')':
        'Go to game start';
      /*Challenge 1*/
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
      
    });
    let status;
    if(winner) {
      status = 'Winner: ' + winner;
    } else {
      /*Challenge 6*/
      const isNullExist = (value) => value === null;
      const indexNull = current.squares.findIndex(isNullExist);
      if(indexNull === -1) {
        status = 'DRAW!!! No One Wins!'
      } else {
        status = 'Next player: '+ (this.state.xIsNext ? 'X' : 'O');
      }
      /*Challenge 6*/
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

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

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
  