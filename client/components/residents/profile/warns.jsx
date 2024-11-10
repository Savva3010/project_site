"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/profile.module.css"

import { useEffect, useState, useReducer } from 'react';

import Warn from './warn';

export default function Warns({ warns, setNoteWarnModal }) {

    function onDelete(idx) {
        return () => {
            setNoteWarnModal({type: "DELETE_WARN", payload: warns[idx]})
        }
    }

    return (<>
        {warns?.length != 0 ?
        <></> :
        <p className={`${css["col3-warns-empty"]}`}>Пусто</p>
        }
        {warns.map((warn, idx) => {
            return <Warn key={idx} warn={warn} onDelete={onDelete(idx)}/>
        })}
    </>);
}