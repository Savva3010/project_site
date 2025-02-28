"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/applications/leave/application.module.css"

import { useEffect, useState, useReducer, useMemo } from 'react';

import File from './file';

import { SERVER_URL, WS_SERVER_URL } from '@/globals';

export default function Files({ info, setFileActionModal }) {

    const [ expanded, setExpanded ] = useState(false)

    function handleClick() {
        setExpanded(prev => prev = !prev)
    }

    function showExpanded() {
        if (!expanded) return <></>

        return (
            <div className={`${css["files-files"]}`}>
                {info?.files.length != 0 ?
                <></> : 
                <p className={`${css["no-files"]}`}>Пусто</p>
                }

                {info?.files.map((file, idx) => {
                    return <File key={idx} info={file} setFileActionModal={setFileActionModal} />
                })}
                <button onClick={() => setFileActionModal({type: "ADD"})} className={`${css["files-add"]}`}>&#43;</button>
            </div>
        )
    }

    return (<>
        <div className={`${css["files"]}`}>
            <button className={`${css["expand"]}`} onClick={handleClick}>
                <p>Скан заявления</p>
                <div>
                    <span className={`bi ${expanded ? "bi-caret-down-fill" : "bi-caret-up-fill"}`}></span>
                    <div></div>
                </div>
            </button>
            {showExpanded()}
        </div>
    </>);
}