"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/journals/cleaning/page.module.css"

import { useEffect, useReducer } from 'react';

import MarkModal from './mark-modal';

export default function Row({ isGrey, dates, room, rowIdx, isInv, markModal, setMarkModal, setMark } ) {
    let sum = 0
    let ammount = 0

    return (
        <tr className={`${isGrey ? css["row-grey"] : ""}`}>
            <th><div><p>{room.room_number}</p></div></th>
            {dates.map((date, idx) => {
                let mark = room.marks.find(mark => mark.date === date)
                if (mark?.mark) {
                    sum += mark.mark
                    ++ammount
                }
                return <td key={idx}><div>
                        {rowIdx != markModal.room || idx != markModal.date ?
                        <></> :
                        <MarkModal setMark={setMark} isInv={isInv}/>}
                        <button onClick={() => setMarkModal({type: "OPEN", payload: {room: rowIdx, date: idx}})}>
                            <p>{mark?.mark || ""}</p>
                        </button>
                    </div></td>
            })}
            <th className={`${css["mean"]}`}><div><p>{ammount != 0 ? (sum / ammount).toFixed(1) : ""}</p></div></th>
            <th><div><p></p></div></th>
            <th><div><p></p></div></th>
            <th><div><p></p></div></th>
            <th><div><p></p></div></th>
            <th><div><p></p></div></th>
        </tr>
        );
  }