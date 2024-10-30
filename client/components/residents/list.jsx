"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/page.module.css"

import { useEffect, useState, useReducer } from 'react';

import { location } from '@/enums';

import ListEl from './list-el';

const URL = "http://localhost:3001"

function useLoader() {
    const INITIAL_STATE = {
        status: "INITIALIZE",
        data: null,
        error: null
    }

    function reducer(state, { type, payload }) {
        switch (type) {
            case "LOADING":
                return {...state, status: "LOADING"}
            case "ERROR":
                return {...state, status: "ERROR", error: payload}
            case "SUCCESS":
                return {...state, status: "SUCCESS", data: payload}
            default:
                return {...state}
        }
    }

    return useReducer(reducer, INITIAL_STATE) 
}

export default function List({ openedProfileId }) {

    const [ residents, setResidents ] = useLoader()

    useEffect(() => {
        setResidents({type: "LOADING"})
        let controller = new AbortController()
        fetch(URL + "/residents", {
            method: "GET",
            header: {

            },
            signal: controller.signal
        })
        .then(res => res.json())
        .then(data => {
            setResidents({type: "SUCCESS", payload: data.data})
        })
        .catch(err => {
            if (err.name == "AbortError") return
            console.error(err)
            setResidents({type: "ERROR", payload: err})
        })

        return () => {
            controller.abort()
        }
    }, [])

    function showResidents() {
        if (residents.status == "INITIALIZE") return <></>
        if (residents.status == "LOADING") {
            return <p className={`${css["loading"]}`}>Загружаем список . . .</p>
        }
        if (residents.status == "ERROR") {
            return <p style={{whiteSpace: "pre-wrap", height: "max-content"}} className={`${css["error"]}`}>Произошла ошибка (да, и такое бывает) ¯\_(ツ)_/¯ 
                <br/>
                Обратитесь к специалисту и попробуйте позже
                <br/>
                <br/>                           
                {residents.error.name}
                <br/>
                {residents.error.message}
                <br/>
                {residents.error.stack}
            </p>
        }
        if (residents.data.length == 0) {
            return <p className={`${css["empty"]}`}>Проживающих нет, меньше работы ^_^</p>
        }

        return (
            <ul>
                <li className={`${css["columns"]}`}>
                        <div>№</div>
                        <div>ФИО</div>
                        <div>Номер тел.</div>
                        <div>Почта</div>
                        <div>Telegram</div>
                        <div>Статус</div>
                        <div></div>
                </li>
                {residents.data.map((resident, idx) => {
                    return (
                        <ListEl key={idx} info={resident} openedProfileId={openedProfileId}/>
                    )
                })}
            </ul>
        )
    }

    return (<>
        <div className={`${css["list"]}`}>
            {showResidents()}
        </div>
    </>);
}