import React, { useEffect, useState } from 'react'
import SideNav from '../components/SideNav'
import Square from '../components/Square';
import { Patterns } from '../utils/Patterns'

const Game = () => {
    const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
    const [player, setPlayer] = useState("O");
    const [result, setResult] = useState({winner: "none", state: "none"});

    useEffect(()=> {
        checkWin();

        if (player === "X") {
            setPlayer("O");
        } else {
            setPlayer("X");
        };
    },[board]);
    useEffect(()=> {
        if (result.state !== "none") {
            alert(`${result.winner} Wins. Game Ended. Restart Game.`)
        }
    },[result])
    const chooseSquare = (square) => {
        setBoard(board.map((val, idx) => {
            if (idx === square && val === "") {
                return player
            }
            return val;
        }))
    }
    const checkWin = ()=> {
        Patterns.forEach((currentPattern) => {
            const firstPlayer = board[currentPattern[0]];
            console.log(currentPattern);
            if (firstPlayer === "") return;
            let foundWinningPattern = true;
            currentPattern.forEach((idx) => {
                if(board[idx] !== firstPlayer) {
                    foundWinningPattern = false;
                }
            })
            if (foundWinningPattern) {
                setResult({winner: player, state: "won",})
            }
        })
    }
    return (
        <div className='game'>
            <div className='board'>
                <div className="row">
                    <Square val={board[0]} chooseSquare={() => { chooseSquare(0) }} />
                    <Square val={board[1]} chooseSquare={() => { chooseSquare(1) }} />
                    <Square val={board[2]} chooseSquare={() => { chooseSquare(2) }} />
                </div>
                <div className="row">
                    <Square val={board[3]} chooseSquare={() => { chooseSquare(3) }} />
                    <Square val={board[4]} chooseSquare={() => { chooseSquare(4) }} />
                    <Square val={board[5]} chooseSquare={() => { chooseSquare(5) }} />
                </div>
                <div className="row">
                    <Square val={board[6]} chooseSquare={() => { chooseSquare(6) }} />
                    <Square val={board[7]} chooseSquare={() => { chooseSquare(7) }} />
                    <Square val={board[8]} chooseSquare={() => { chooseSquare(8) }} />
                </div>
            </div>
            <SideNav />
        </div>
    )
}

export default Game