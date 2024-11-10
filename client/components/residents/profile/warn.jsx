"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/warn.module.css"

import { useEffect, useState, useReducer } from 'react';

export default function Warn({ warn, onDelete, content, setContent, placeholder }) {

    return (<>

        <div className={`${css["warn"]}`}>
            {!onDelete ?
                <></> : 
                <button onClick={onDelete} className={`${css["warn-close"]}`}>
                    <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 8.88166L1.39024 1M9.78049 1.11834L1 9" stroke="#AAAAAA"/>
                    </svg>
                </button>
            }

            {!setContent ? 
            <p>{warn?.text}</p> :
            <textarea placeholder={placeholder} onChange={(evt) => setContent(evt.target.value)}>{content}</textarea>
            }
            <p>&nbsp;</p>
            <p>От {warn?.author}</p>
            <p>{warn?.date}</p>
        </div>
    </>);
}