"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/journals/cleaning/page.module.css"

import { useEffect, useReducer } from 'react';

import Row from './row';

export default function Cleaning() {

    const data = {
        "dates": [
            "8 СЕН",
            "8 СОС"
        ],
        "rooms": [
            {
                "room_number": "201",
                "marks": [
                    {
                        "date": "8 СЕН",
                        "mark": 5
                    },
                    {
                        "date": "8 СОС",
                        "mark": 5
                    }
                ]
            },
            {
                "room_number": "202",
                "marks": [
                    {
                        "date": "8 СЕН",
                        "mark": 2
                    },
                    {
                        "date": "8 СОС",
                        "mark": 2
                    }
                ]
            },
            {
                "room_number": "203",
                "marks": [
                    {
                        "date": "8 СЕН",
                        "mark": 2
                    },
                    {
                        "date": "8 СОС",
                        "mark": 2
                    }
                ]
            },
            {
                "room_number": "203",
                "marks": [
                    {
                        "date": "8 СЕН",
                        "mark": 2
                    },
                    {
                        "date": "8 СОС",
                        "mark": 2
                    }
                ]
            },
            {
                "room_number": "203",
                "marks": [
                    {
                        "date": "8 СЕН",
                        "mark": 2
                    },
                    {
                        "date": "8 СОС",
                        "mark": 2
                    }
                ]
            }
        ]
    }

    return (<>

        <h1 className={`${css["head"]}`}>Journal</h1>
        <table className={`${css["table"]}`}>
            <thead>
            <tr>
                <th className={`${css["first_head_cell"]}`}>
                    <p>№</p>
                </th>
                {data.dates.map((date, idx) => {
                    return <th key={idx} className={`${css["head_cell"]}`}>{date}</th>
                })}
            </tr>
            </thead>
            <tbody>
            {data.rooms.map((room, idx) => {
                return <Row dates={data.dates} room={room} className={`${idx % 2 == 0 ? css["grey"] : ""}`} />
            })}
            </tbody>
        </table>

    </>);
  }