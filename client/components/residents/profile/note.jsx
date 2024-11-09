"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/note.module.css"

import { useEffect, useState, useReducer } from 'react';

export default function Note({ note, onDelete }) {

    return (<>
        <div className={`${css["note"]}`}>
            <div className={`${css["note-corner"]}`}>
                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0L31 15.5L17.9957 30L0 0Z" fill="#FFEEAA"/>
                 </svg>
            </div>

            {!onDelete ?
            <></> : 
            <button onClick={onDelete} className={`${css["note-close"]}`}>
                <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 8.88166L1.39024 1M9.78049 1.11834L1 9" stroke="#AAAAAA"/>
                </svg>
            </button>
            }

            <p>{note}</p>
        </div>
    </>);
}