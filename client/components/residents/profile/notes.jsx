"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/profile.module.css"

import { useEffect, useState, useReducer } from 'react';

import Note from './note';

export default function Notes({ notes }) {

    function onDelete(idx) {
        return () => {
            // delete
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