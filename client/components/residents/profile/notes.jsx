"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/profile.module.css"

import { useEffect, useState, useReducer } from 'react';

export default function Notes({ notes }) {

    return (<>
        {notes?.length != 0 ?
        <></> :
        <p className={`${css["col3-notes-empty"]}`}>Пусто</p>
        }
        {notes.map((note, idx) => {
            return <div key={idx} className={`${css["col3-note"]}`}>
                <div className={`${css["col3-note-corner"]}`}>
                    <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0L31 15.5L17.9957 30L0 0Z" fill="#FFEEAA"/>
                    </svg>
                </div>
        
                <p>{note}</p>
            </div>
        })}
    </>);
}