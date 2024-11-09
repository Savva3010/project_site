"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/journals/cleaning/page.module.css"

import { useEffect, useReducer } from 'react';

export default function Row({ isGrey, dates, room } ) {
    let sum = 0
    let ammount = 0
    return (
        <tr className={`${isGrey ? css["row-grey"] : ""}`}>
            <th><div><p>{room.room_number}</p></div></th>
            {dates.map((date, idx) => {
                let mark = room.marks.find(mark => mark.date == date)
                if (mark?. mark) {
                    sum += mark.mark
                    ++ammount
                }
                return <td key={idx}><div><p>{mark?.mark || ""}</p></div></td>
            })}
            <th className={`${css["mean"]}`}><div><p>{(sum / ammount).toFixed(1)}</p></div></th>
            <th><div><p></p></div></th>
            <th><div><p></p></div></th>
            <th><div><p></p></div></th>
            <th><div><p></p></div></th>
            <th><div><p></p></div></th>
        </tr>
        );
  }