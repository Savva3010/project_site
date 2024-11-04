"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/profile.module.css"

import { useEffect, useState, useReducer } from 'react';

export default function Warns({ warns }) {

    return (<>
        {warns?.length != 0 ?
        <></> :
        <p className={`${css["col3-warns-empty"]}`}>Пусто</p>
        }
        {warns.map((warn, idx) => {
            return <div key={idx} className={`${css["col3-warn"]}`}>
                <p>{warn?.text}</p>
                <p></p>
                <p>От {warn?.author}</p>
                <p>{warn?.date}</p>
            </div>
        })}
    </>);
}