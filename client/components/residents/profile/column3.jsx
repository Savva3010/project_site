"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/profile.module.css"

import { useEffect, useState, useReducer } from 'react';

import Notes from './notes';
import Warns from './warns';

export default function Column3({ info, setAddPanel }) {

    const [ page, setPage ] = useState("NOTES")

    const notes = [
        "Ну это заметка",
        `Ну это заметка
        
Она многострочная`,

        `Это тоже заметка

1
1  2  1
1  3  3  1
1  4  6  4  1`,
        "https://youtube.com/?v=dQw4w9WgXcQ",
        "asdalkdjsajdlkjasdlkajslkdjlkasjldkjaslkdjklsajdlkjaskldjklasjdklsajkldjaskldjklasjdklaskldjklasjdajsldjklasjdklsajkldjklasjdklaskldlaksjdklasjdlkasjdljaklsdj",
        `a
b
c
d
e
f
g`
]

    const warns = [
        {
            "text": "Ну это замечание",
            "author": "Серебренников Савва Андреевич AA",
            "date": "19.09.2024"
        },
        {
            "text": "Ну это тоже замечание",
            "author": "Серебренников Савва Андреевич BB",
            "date": "19.09.2025"
        },
        {
            "text": "Чтосюдаписат",
            "author": "Серебренников Савва Андреевич CC",
            "date": "19.09.2026"
        },
        {
            "text": "lwehgmwaomgvoeoroleibjolmjeojmrgolemsrjoiejrohjbisejrboijseroibgmserjbgolmimjsoerblsemrjgbiosemjrogbemjsorlgselrgobmjseorgbmejsrgbojseorigbjosemrjmbgosejmr",
            "author": "Серебренников Савва Андреевич DD",
            "date": "19.09.2027"
        },
]

    return (<>
        <div className={`${css["col3"]}`}>
            <div className={`${css["col3-btns"]}`}>
                <button className={`${css["col3-btn"]} ${page == "NOTES" ? css["col3-btn-notes-active"] : ""}`} onClick={() => setPage("NOTES")}>
                    {page == "NOTES" ? 
                    <b>Заметки</b> :
                    "Заметки"
                    }
                    <button className={`${css["col3-btn-add"]}`} onClick={() => setAddPanel("NOTES")}>&#43;</button>
                </button>
                <button className={`${css["col3-btn"]} ${page == "WARNS" ? css["col3-btn-warns-active"] : ""}`} onClick={() => setPage("WARNS")}>
                    {page == "WARNS" ? 
                    <b>Замечания</b> :
                    "Замечания"
                    }  
                    <button className={`${css["col3-btn-add"]}`} onClick={() => setAddPanel("WARNS")}>&#43;</button>
                </button>
            </div>
            <div className={`${css["col3-column"]}`}>
                {page == "NOTES" ?
                <Notes notes={notes} /> :
                <Warns warns={warns} />
                }
            </div>
        </div>
    </>);
}