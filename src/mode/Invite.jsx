import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Patterns } from '../utils/Patterns';
import Modal from '../components/Modal'
import '../styles/cross.css';
import { useAuth } from '../utils/ContextAPI';

let roomId;
let name = "";
let opposite;
let turn = "X";
let dropzone;
let dropzoneId;
let boxId;
let currentPlayer;

const Quick = ({ socket }) => {
    // const {  } = useAuth();
    const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
    const [player, setPlayer] = useState("X");
    const [info, setInfo] = useState("");
    const [start, setStart] = useState(false);
    const [game, setGame] = useState({});

    useEffect(() => {
        socket.on("qfind", (TPMPlaying) => {
            setTimeout(() => {
                handleState(TPMPlaying);
            }, 2000);
        });
    }, [socket]);

    useEffect(() => {
        socket.on('drop', async({data, dropzoneId}) => {
            let temp = await document.getElementById(data);
            const allBox = document.querySelectorAll(".dropBox");
            let found = allBox[dropzoneId];
            data && await found.appendChild(temp);
            console.log(turn);
        });
        checkWin();
    }, [socket, dropzone]);

    useEffect(() => {
        socket.on("qplay", (value)=> {
            turn = value;
            console.log(turn + " turn");
            console.log(value + " value");
        })
        socket.on('nextTurn', (nextPlayer) => {
            currentPlayer = nextPlayer;
            if (player === currentPlayer) {
              $('#board').append('<p>Your turn!</p>');
            } else {
              $('#board').append('<p>Waiting for opponent...</p>');
            }
          });
    }, []);

    console.log(name)

    function refreshPage() {
        window.location.reload();
    }

    async function handleState(state) {
        const found = await state?.find(item => item.p1.P1Name === name || item.p2.P2Name === name);
        found.p1.P1Name === name ? opposite = found.p2.P2Name : opposite = found.p1.P1Name;
        found?.p1?.P1Name === name ? setPlayer(found?.p1?.P1Val) : setPlayer(found?.p2?.P2Val)
        setGame(found);
        setStart(true);
    }

    function onChange(e) {
        name = e.target.value;
    }

    const generateId = () => {
        const id = Math.floor(Math.random() * 2000);
        return id;
    }

    function airDrop(e) {
        e.preventDefault();
    }

    function Drop(e, square) {
        e.preventDefault();
        var data = e.dataTransfer.getData("text");
        dropzone = e.target;
        dropzoneId = e.target.id;
        // const newPosition = { x: e.clientX, y: e.clientY };
        if (turn === "X" && data === "X1" || data === "X2" || data === "X3") {
            e.target.appendChild(document.getElementById(data));
            // Send the movePiece event to the server
            //    socket.emit('movePiece', { data, newPosition });
            socket.emit('drop', {data, dropzoneId});
        } else if (turn === "O" && data === "O1" || data === "O2" || data === "O3") {
            e.target.appendChild(document.getElementById(data));
            // Send the movePiece event to the server
            //    socket.emit('movePiece', { data, newPosition });
            socket.emit('drop', {data, dropzoneId});
        }
        setBoard(board.map((val, idx) => {
            if (idx === square && val === "") {
                socket.emit("playing", {name});
                return player
            }
            return val;
        }))

        checkWin();
    }

    function Drag(e) {
        e.dataTransfer.setData("text", e.target.id);
    }

    function checkWin() {
        const allBox = document.querySelectorAll(".dropBox");
        Patterns.forEach(item => {
            const Xwins = item.every(square => allBox[square].firstChild?.classList.contains('cross'))
            if (Xwins) {
                setInfo("Player X wins");
                alert("Player X wins")
                allBox.forEach(tin => tin.replaceWith(tin.cloneNode(true)));
                return;
            }
        });

        Patterns.forEach(item => {
            const Owins = item.every(square => allBox[square].firstChild?.classList.contains('circle'))
            if (Owins) {
                setInfo("Player O wins");
                alert("Player O wins")
                allBox.forEach(tin => tin.replaceWith(tin.cloneNode(true)));
                return;
            }
        });
    }

    const handleSave = async () => {
        roomId = await generateId()
        console.log(roomId);
        let content = {
            room: roomId,
            data: {
                name: name,
                turn: "X",
                message: "Welcome to Tic Tac Toe on the Solana Blockchain"
            }
        }
        await socket.emit("qfind", { roomId, name });
    };

    return (
        <div className='relative flex items-center flex-col h-screen min-h-screen justify-center py-2 w-full bg-amber-500'>
            <div className='flex w-full justify-between items-center px-4'>
                <div className='p-1 bg-black text-white rounded'>
                    <h1 className="uppercase font-bold">Opponent: {game?.p1?.P1Name === name ? game?.p2?.P2Val : game?.p1?.P1Val}: {opposite}</h1>
                </div>
                <span className="p-2 my-1 bg-stone-500 text-white font-bold rounded-full">VS</span>
                <div className='bg-black text-white p-1 rounded'>
                    <h1 className="uppercase font-bold">{game?.p1?.P1Name === name ? game?.p1?.P1Val : game?.p2?.P2Val}: {name}</h1>
                </div>
            </div>
            <span className="p-1 my-1 bg-stone-500 text-white font-bold">It's {turn}'s Turn</span>
            <div className='flex justify-center items-center h-full w-full'>
                <div className='drag flex relative justify-center items-center flex-col h-[420px] w-[100px] gap-2 mx-10 cursor-grab'>
                    <div className="dragbox p-4 bg-slate-900/50">
                        <div className="cross relative w-12 h-12 flex justify-center items-center before:absolute before:w-1 before:h-full before:bg-white before:rotate-45 after:absolute after:w-full after:h-1 after:bg-white after:rotate-45" draggable={turn === "X" ? true : false} onDragStart={Drag} id='X1'>X</div>
                    </div>
                    <div className="dragbox p-4 bg-slate-900/50">
                        <div className="cross relative w-12 h-12 flex justify-center items-center before:absolute before:w-1 before:h-full before:bg-white before:rotate-45 after:absolute after:w-full after:h-1 after:bg-white after:rotate-45" draggable={turn === "X"  ? true : false} onDragStart={Drag} id='X2'>X</div>
                    </div>
                    <div className="dragbox p-4 bg-slate-900/50">
                        <div className="cross relative w-12 h-12 flex justify-center items-center before:absolute before:w-1 before:h-full before:bg-white before:rotate-45 after:absolute after:w-full after:h-1 after:bg-white after:rotate-45" draggable={turn === "X"  ? true : false} onDragStart={Drag} id='X3'>X</div>
                    </div>
                </div>
                <div className="relative grid grid-cols-3">
                    <div className="dropBox relative w-[140px] h-[140px] border-r-4 border-white border-b-4 p-3 flex justify-center items-center cursor-default scale-105" onDrop={(e) => Drop(e, 0)} onDragOver={airDrop} id='0'></div>
                    <div className="dropBox relative w-[140px] h-[140px] border-r-4 border-white border-b-4 p-3 flex justify-center items-center cursor-default scale-105" onDrop={(e) => Drop(e, 1)} onDragOver={airDrop} id='1'></div>
                    <div className="dropBox relative w-[140px] h-[140px] border-white border-b-4 p-3 flex justify-center items-center cursor-default scale-105" onDrop={(e) => Drop(e, 2)} onDragOver={airDrop} id='2'></div>
                    <div className="dropBox relative w-[140px] h-[140px] border-r-4 border-white border-b-4 p-3 flex justify-center items-center cursor-default scale-105" onDrop={(e) => Drop(e, 3)} onDragOver={airDrop} id='3'></div>
                    <div className="dropBox relative w-[140px] h-[140px] border-r-4 border-white border-b-4 p-3 flex justify-center items-center cursor-default scale-105" onDrop={(e) => Drop(e, 4)} onDragOver={airDrop} id='4'></div>
                    <div className="dropBox relative w-[140px] h-[140px] border-white border-b-4 p-3 flex justify-center items-center cursor-default scale-105" onDrop={(e) => Drop(e, 5)} onDragOver={airDrop} id='5'></div>
                    <div className="dropBox relative w-[140px] h-[140px] border-r-4 border-white p-3 flex justify-center items-center cursor-default scale-105" onDrop={(e) => Drop(e, 6)} onDragOver={airDrop} id='6'></div>
                    <div className="dropBox relative w-[140px] h-[140px] border-r-4 border-white p-3 flex justify-center items-center cursor-default scale-105" onDrop={(e) => Drop(e, 7)} onDragOver={airDrop} id='7'></div>
                    <div className="dropBox relative w-[140px] h-[140px] p-3 flex justify-center items-center cursor-default scale-105" onDrop={(e) => Drop(e, 8)} onDragOver={airDrop} id='8'></div>
                </div>
                <div className='drag flex relative justify-center items-center flex-col h-[420px] w-[100px] gap-2 mx-10 cursor-grab'>
                    <div className="dragbox bg-slate-900/50 p-2">
                        <div className="circle relative w-12 h-12 border-4 border-white rounded-full" onDragStart={Drag} draggable={turn === "O" ? true : false} id='O1'></div>
                    </div>
                    <div className="dragbox bg-slate-900/50 p-2">
                        <div className="circle relative w-12 h-12 border-4 border-white rounded-full" onDragStart={Drag} draggable={turn === "O" ? true : false} id='O2'></div>
                    </div>
                    <div className="dragbox bg-slate-900/50 p-2">
                        <div className="circle relative w-12 h-12 border-4 border-white rounded-full" onDragStart={Drag} draggable={turn === "O" ? true : false} id='O3'></div>
                    </div>
                </div>
            </div>
            <span>{info}</span>
            <button className='reset py-2 px-6 bg-black text-white cursor-pointer' onClick={refreshPage}>Reset</button>
            {!start && (
                <Modal>
                    <h1 className="text-3xl font-bold text-center">Quick Game Mode</h1>
                    <p className='text-sm text-center'>
                        <em>
                            Play with any random player available online
                        </em>
                    </p>
                    <div className='flex w-full p-3 h-full'>
                        <div className='f1 p-2 flex flex-col'>
                            <input
                                className="border-2 p-1 "
                                type="text"
                                placeholder="name"
                                name='name'
                                onChange={onChange}
                            />
                            <button onClick={handleSave} className="border my-2 p-2 text-xl">
                                Create Game Room
                            </button>
                        </div>
                    </div>
                </Modal>)}
        </div>
    )
}

export default Quick