"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/journals/cleaning/page.module.css"

import { useEffect, useReducer } from 'react';


export default function Row({ className, dates, room } ) {
    return (
        <tr className={`${css["row"]} ${className || ""}`}>
            <th className={`${css["first_cell"]}`}>{room.room_number}</th>
            {dates.map((date, idx) => {
                    return <th key={idx} className={`${css["cell"]}`}>{room.marks.find(mark => mark.date == date)?.mark || ""}</th>
            })}
        </tr>
        );
  }