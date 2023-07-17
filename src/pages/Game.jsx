import React, { useEffect, useState, useRef } from 'react'
import SideNav from '../components/SideNav'
import Square from '../components/Square';
import { Patterns } from '../utils/Patterns'

const Game = () => {
    const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
    const [player, setPlayer] = useState("O");
    const [result, setResult] = useState({ winner: "none", state: "none" });
    const [open, setOpen] = useState(true);
    const [round, setRound] = useState(1);
    function toggleMenu() {
        setOpen(!open);
    }
    const [xPlay, setXPlay] = useState({
        x1:"",
        x2:"",
        x3:""
    });
    const [oPlay, setOPlay] = useState({
        o1:"",
        o2:"",
        o3:""
    });
    const [val, setVal] = useState(0);
    const [xVal, setXVal] = useState(0);
    const [oVal, setOVal] = useState(0);
    // save only 3 moves from the x Player, remove previous moves from array
    const xplay = [];
    // save only 3 moves from the o Player, remove previous moves from array
    const oplay = [];
    function xoPush(e) {
       
    }
    // const clk = document.querySelectorAll('.square');
    // clk.forEach(item => item.addEventListener('click', xoPush))

    // Makes sure only three id's of a player are on the board
    const box1 = useRef();
    function Play() {
        if (player === "X" ) {
            
        } else if (player === "O" ) {
            
        }
    }

    useEffect(() => {
        checkWin();
        checkDraw();
        if (player === "X") {
            setPlayer("O");
        } else {
            setPlayer("X");
        };
    }, [board]);
    useEffect(() => {
        if (result.state !== "none") {
            alert(`${result.winner} Wins. Game Ended. Restart Game.`);
            restartGame();
        }
    }, [result])

    const chooseSquare = (square, e) => {
        setBoard(board.map((val, idx) => {
            if (idx === square && val === "") {
                return player
            }
            return val;
        }))
        
        const { id } = e.target;
        console.log(id);
        if (player === "X") {
            xplay.push(xPlay.x1, xPlay.x2, xPlay.x3);
            oplay.push(oPlay.o1, oPlay.o2, oPlay.o3);
            setXVal(vid =>    {if (vid > 1) return 0
                return vid + 1
            });
            xVal === 0 && setXPlay({
                ...xPlay,
                ["x1"]: id
            });
            xVal === 1 && setXPlay({
                ...xPlay,
                ["x2"]: id
            });
            xVal === 2 && setXPlay({
                ...xPlay,
                ["x3"]: id
            });
        } else if (player === "O") {
            setOVal(vid =>    {if (vid > 1) return 0
                return vid + 1
            });
            oVal === 0 && setOPlay({
                ...oPlay,
                ["o1"]: id
            });
            oVal === 1 && setOPlay({
                ...oPlay,
                ["o2"]: id
            });
            oVal === 2 && setOPlay({
                ...oPlay,
                ["o3"]: id
            });
            xplay.push(xPlay.x1, xPlay.x2, xPlay.x3);
            oplay.push(oPlay.o1, oPlay.o2, oPlay.o3);
        };
        setVal(val + 1);
        console.log(xVal, oVal);
        console.log(xPlay, oPlay);
        console.log(xPlay.x1, oPlay.o1);
        console.log(xplay, oplay);
        //   xoPush();
    }
    const checkWin = () => {
        Patterns.forEach((currentPattern) => {
            const firstPlayer = board[currentPattern[0]];
            // console.log(currentPattern);
            if (firstPlayer === "") return;
            let foundWinningPattern = true;
            currentPattern.forEach((idx) => {
                if (board[idx] !== firstPlayer) {
                    foundWinningPattern = false;
                }
            })
            if (foundWinningPattern) {
                setXPlay([]);
                setOPlay([]);
                setXVal(0);
                setOVal(0);
                setResult({ winner: player, state: "won", })
            }
        })
    }

    function checkDraw() {
        let filled = true;
        board.forEach((square) => {
            if (square === "") {
                filled = false;
            }
        });

        if (filled) {
            setResult({ winner: "No winner", state: "Draw" })
        }
    };

    const restartGame = () => {
        setBoard(["", "", "", "", "", "", "", "", ""]);
        if (player === "X") {
            setPlayer("O");
        } else {
            setPlayer("X");
        };
    }
    return (
        <div className='game'> Tic Tac Toe Game OnChain Building in Progress...
            {!open && <div className='board'>Round: 1, PlayerX:__ , PlayerO:___
                <div className="row">
                    <Square val={board[0]} chooseSquare={(e) => { chooseSquare(0, e) }} id='0' />
                    <Square val={board[1]} chooseSquare={(e) => { chooseSquare(1, e) }} id='1' />
                    <Square val={board[2]} chooseSquare={(e) => { chooseSquare(2, e) }} id='2' />
                </div>
                <div className="row">
                    <Square val={board[3]} chooseSquare={(e) => { chooseSquare(3, e) }} id='3' />
                    <Square val={board[4]} chooseSquare={(e) => { chooseSquare(4, e) }} id='4' />
                    <Square val={board[5]} chooseSquare={(e) => { chooseSquare(5, e) }} id='5' />
                </div>
                <div className="row">
                    <Square val={board[6]} chooseSquare={(e) => { chooseSquare(6, e) }} id='6' />
                    <Square val={board[7]} chooseSquare={(e) => { chooseSquare(7, e) }} id='7' />
                    <Square val={board[8]} chooseSquare={(e) => { chooseSquare(8, e) }} id='8' />
                </div>
            </div>}
            <SideNav open={open} toggleMenu={toggleMenu} />
        </div>
    )
}

export default Game