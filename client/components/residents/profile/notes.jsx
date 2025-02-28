"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/profile.module.css"

import { useEffect, useState, useReducer } from 'react';

import Note from './note';

export default function Notes({ notes, setNoteWarnModal }) {

    // Open delete_note modal
    function onDelete(idx) {
        return () => {
            setNoteWarnModal({type: "DELETE_NOTE", payload: notes[idx]})
        }
    }
    
    return (<>
        {notes?.length != 0 ?
        <></> :
        <p className={`${css["col3-notes-empty"]}`}>Пусто</p>
        }
        {notes.map((note, idx) => {
            return <Note key={idx} note={note} onDelete={onDelete(idx)}/>
        })}
    </>);
}