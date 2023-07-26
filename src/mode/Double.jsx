import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Square from "../components/Square";

const Double = ({ socket, name }) => {
    const {roomId} = useParams();
    console.log(roomId);
    const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
    const [canPlay, setCanPlay] = useState(true);
    const [Player, setPlayer] = useState("X");
    const [Players, setPlayers] = useState([]);
    console.log(Players);
    let oppositePlayer;
    let value;
    
    useEffect(() => {
        socket.on("name", (e)=>{
            console.log(e.players);
            setPlayers(e.players);
            const found = Players.find(obx => obx.p1.P1Name === name || obx.p2.P2Name === name);
            found.p1.P1Name === name ? oppositePlayer = found.p2.P2Name : oppositePlayer = found.p1.P1Name
            found.p1.P1Name === name ? value = found.p2.P2Val : oppositePlayer = found.p1.P1Val
        })
        socket.on("data", (TPMPlaying)=> {
            console.log(TPMPlaying);
        })
        socket.on("updateGame", (id) => {
            console.log("use Effect", id);
            setBoard((data) => ({ ...data, [id]: Player }));
            if (Player === "X") {
                setPlayer("O");
            } else {
                setPlayer("X")
            }
            setCanPlay(true);
        }, [canPlay]);
        return () => socket.off("updateGame");
    });

    const handleCell = (e) => {
        const id = e.currentTarget.id;
        if (canPlay && board[id] === "") {
            setBoard((data) => ({ ...data, [id]: Player }));
            // if (Player === "X") {
            //     setPlayer("O");
            // } else {
            //     setPlayer("X")
            // }
            socket.emit("play", { id, roomId });
            setCanPlay(false);
        }

        if (
            (board[0] === "X" && board[1] === "X" && board[2] === "X") ||
            (board[0] === "O" && board[1] === "O" && board[2] === "O")
        ) {
            setBoard(["", "", "", "", "", "", "", "", ""]);
        }
    };

    return (
        <div className='flex items-center justify-center relative'>
            <div className='board'>
                <h1>
                    Round: 1, PlayerX:{name} , PlayerO:{oppositePlayer}, its {value}'s turn
                </h1>
                <div className="row">
                    <Square val={board[0]} chooseSquare={(e) => { handleCell(e) }} id='0' />
                    <Square val={board[1]} chooseSquare={(e) => { handleCell(e) }} id='1' />
                    <Square val={board[2]} chooseSquare={(e) => { handleCell(e) }} id='2' />
                </div>
                <div className="row">
                    <Square val={board[3]} chooseSquare={(e) => { handleCell(e) }} id='3' />
                    <Square val={board[4]} chooseSquare={(e) => { handleCell(e) }} id='4' />
                    <Square val={board[5]} chooseSquare={(e) => { handleCell(e) }} id='5' />
                </div>
                <div className="row">
                    <Square val={board[6]} chooseSquare={(e) => { handleCell(e) }} id='6' />
                    <Square val={board[7]} chooseSquare={(e) => { handleCell(e) }} id='7' />
                    <Square val={board[8]} chooseSquare={(e) => { handleCell(e) }} id='8' />
                </div>
            </div>
            <div></div>
        </div>
    );
};

export default Double;
