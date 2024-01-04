import React, { useState } from 'react';
import { Patterns } from '../utils/Patterns';
import '../styles/cross.css';

const DoublePlayer = () => {
    const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
    const [player, setPlayer] = useState("X");
    const [info, setInfo] = useState("");

    function airDrop(e) {
        e.preventDefault();
    }

    function Drop(e, square) {
        e.preventDefault();
        var data = e.dataTransfer.getData("text");
        if (player === "X" && data === "X1" || data === "X2" || data === "X3") {
            e.target.appendChild(document.getElementById(data));
            setPlayer("O")
        } else if (player === "O" && data === "O1" || data === "O2" || data === "O3") {
            e.target.appendChild(document.getElementById(data));
            setPlayer("X")
        }
        setBoard(board.map((val, idx) => {
            if (idx === square && val === "") {
                return player
            }
            return val;
        }))
        checkWin();
    }
    console.log(board);
    console.log(player);

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

    return (
        <div className='flex items-center flex-col h-screen min-h-screen justify-center py-2 w-full bg-amber-500'>
            <div className='flex justify-center items-center h-full w-full'>
                <div className='drag flex relative justify-center items-center flex-col h-[420px] w-[100px] gap-2 mx-10 cursor-grab'>
                    <div className="dragbox p-4 bg-slate-900/50">
                        <div className="cross relative w-12 h-12 flex justify-center items-center before:absolute before:w-1 before:h-full before:bg-white before:rotate-45 after:absolute after:w-full after:h-1 after:bg-white after:rotate-45" draggable="true" onDragStart={Drag} id='X1'>X</div>
                    </div>
                    <div className="dragbox p-4 bg-slate-900/50">
                        <div className="cross relative w-12 h-12 flex justify-center items-center before:absolute before:w-1 before:h-full before:bg-white before:rotate-45 after:absolute after:w-full after:h-1 after:bg-white after:rotate-45" draggable="true" onDragStart={Drag} id='X2'>X</div>
                    </div>
                    <div className="dragbox p-4 bg-slate-900/50">
                        <div className="cross relative w-12 h-12 flex justify-center items-center before:absolute before:w-1 before:h-full before:bg-white before:rotate-45 after:absolute after:w-full after:h-1 after:bg-white after:rotate-45" draggable="true" onDragStart={Drag} id='X3'>X</div>
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
                        <div className="circle relative w-12 h-12 border-4 border-white rounded-full" onDragStart={Drag} draggable="true" id='O1'></div>
                    </div>
                    <div className="dragbox bg-slate-900/50 p-2">
                        <div className="circle relative w-12 h-12 border-4 border-white rounded-full" onDragStart={Drag} draggable="true" id='O2'></div>
                    </div>
                    <div className="dragbox bg-slate-900/50 p-2">
                        <div className="circle relative w-12 h-12 border-4 border-white rounded-full" onDragStart={Drag} draggable="true" id='O3'></div>
                    </div>
                </div>
            </div>
            <span>{info}</span>
            <button className='reset py-2 px-6 bg-black text-white cursor-pointer'>Reset</button>
        </div>
    )
}

export default DoublePlayer