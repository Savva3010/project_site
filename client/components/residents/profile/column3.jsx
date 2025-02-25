"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/profile.module.css"

import { useEffect, useState, useReducer } from 'react';

import Notes from './notes';
import Warns from './warns';

export default function Column3({ info, setNoteWarnModal }) {

    const [ page, setPage ] = useState("NOTES")

    return (<>
        <div className={`${css["col3"]}`}>
            <div className={`${css["col3-btns"]}`}>
                <button className={`${css["col3-btn"]} ${page === "NOTES" ? css["col3-btn-notes-active"] : ""}`} onClick={() => setPage("NOTES")}>
                    {page === "NOTES" ? 
                    <b>Заметки</b> :
                    "Заметки"
                    }
                    <button className={`${css["col3-btn-add"]}`} onClick={() => setNoteWarnModal({type: "ADD_NOTE"})}>&#43;</button>
                </button>
                <button className={`${css["col3-btn"]} ${page === "WARNS" ? css["col3-btn-warns-active"] : ""}`} onClick={() => setPage("WARNS")}>
                    {page === "WARNS" ? 
                    <b>Замечания</b> :
                    "Замечания"
                    }  
                    <button className={`${css["col3-btn-add"]}`} onClick={() => setNoteWarnModal({type: "ADD_WARN"})}>&#43;</button>
                </button>
            </div>
            <div className={`${css["col3-column"]}`}>
                {page === "NOTES" ?
                <Notes notes={info?.notes || []} setNoteWarnModal={setNoteWarnModal}/> :
                <Warns warns={info?.warns || []} setNoteWarnModal={setNoteWarnModal}/>
                }
            </div>
        </div>
    </>);
}