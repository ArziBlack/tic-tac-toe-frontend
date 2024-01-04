import React, { useEffect, useState } from 'react'
import { Patterns } from '../utils/Patterns'
import Square from '../components/Square'
import GameModal from '../components/GameModal';

export const Demo = () => {
    const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
    const [player, setPlayer] = useState("X");
    const [full, setFull] = useState();
    const [result, setResult] = useState({ winner: "none", state: "none" });
    const [round, setRound] = useState(1);
    const [Start, setStart] = useState(false);
    // save only 3 moves from the x Player, remove previous moves from array
    const xplay = [];
    // save only 3 moves from the o Player, remove previous moves from array
    const oplay = [];
    const [xVal, setXVal] = useState(0);
    const [oVal, setOVal] = useState(0);
    const [val, setVal] = useState(0);
    const [xPlay, setXPlay] = useState({
        x1: "",
        x2: "",
        x3: ""
    });
    const [oPlay, setOPlay] = useState({
        o1: "",
        o2: "",
        o3: ""
    });
    function toggleStart() {
        setStart(!Start);
    };
    useEffect(() => {
        checkWin();
        // checkDraw();
        if (player === "X") {
            setPlayer("O");
        } else {
            setPlayer("X");
        };
    }, [board]);
    useEffect(() => {
        if (result.state === "none" && round === 1) {
            start();
        }
        if (result.state === "won" && round === 1) {
            alert(`${result.winner} Wins. Second Round. Game Started!.`);
            secondRound();
        }
        if (result.state === "Draw" && round === 2) {
            alert(`${result.winner} Wins. Game Ended in a Tie. Go Third Round. Game Started!!.`);
            thirdRound();
        }
        if (result.state !== "none" && round === 1) {
            alert(`${result.winner} Wins. Game Ended. Restart Game.`);
            secondRound();
        }
        if (result.state !== "none" && round === 2) {
            alert(`${result.winner} Wins. Game Ended. Restart Game.`);
            restartGame();
        }
        if (result.state !== "none" && round === 3) {
            alert(`${result.winner} Wins. Game Ended. Restart Game.`);
            restartGame();
        }
    }, [result])

    function updateBox() {
        // setBoard(board.filter((item, idx)=> if () item === "X" && idx === full.x1 || idx === full.x2 || idx === full.x3 || idx === full.y1 || idx === full.y2 || idx === full.y3));
        // setBoard();
    }

    // 08036274596
    const chooseSquare = (square, e) => {
        setBoard(board.map((val, idx) => {
            if (idx === square && val === "") {
                return player
            }
            return val;
        }))

        const { id } = e.target;
        if (player === "X") {
            xplay.push(xPlay.x1, xPlay.x2, xPlay.x3);
            oplay.push(oPlay.o1, oPlay.o2, oPlay.o3);
            setXVal(vid => {
                if (vid > 1) return 0
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
            setOVal(vid => {
                if (vid > 1) return 0
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
        var xop = xplay.concat(oplay);
        setFull(xop);
    }
    const restartGame = () => {
        setBoard(["", "", "", "", "", "", "", "", ""]);
        if (player === "X") {
            setPlayer("O");
        } else {
            setPlayer("X");
        };
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
                setResult({ winner: player, state: "won", });
            } else {
                checkDraw();
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

        if (filled && checkWin()) {
            setResult({ winner: "No winner", state: "Draw" })
        }
    };
    const secondRound = () => {
        setRound(2);
        setBoard(["", "", "", "", "", "", "", "", ""]);
        if (player === "X") {
            setPlayer("O");
        } else {
            setPlayer("X");
        };
        setXPlay([]);
        setOPlay([]);
        setXVal(0);
        setOVal(0);
    }
    function thirdRound() {
        setRound(3);
        setBoard(["", "", "", "", "", "", "", "", ""]);
        if (player === "X") {
            setPlayer("O");
        } else {
            setPlayer("X");
        };
        setXPlay([]);
        setOPlay([]);
        setXVal(0);
        setOVal(0);
    }
    function start() {
        console.log("game started");
        setPlayer("X");
        setStart(true)
    }
    return (
        <div className='flex items-center justify-center'>
            <div className='board'>
                <h1> 
                    Round: {round}, PlayerX:__ , PlayerO:___
                </h1>
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
            </div>
            {Start && (<GameModal toggleStart={toggleStart} />)}
        </div>
    )
}
