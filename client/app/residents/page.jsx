"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/page.module.css"

import { useEffect, useState, useReducer } from 'react';

import { location } from '@/enums';

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

export default function Residents() {

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
                        <li key={idx}>
                            <div>STATIC</div>
                            <div>{resident["full_name"]}</div>
                            <div>{resident["mobile"]}</div>
                            <div>{resident["email"]}</div>
                            <div>{resident["telegram"]}</div>
                            <div className={`${css[`status-${location.getInfo(resident.status.status)[1]}`]}`}>
                                {location.getInfo(resident.status.status)[0]}
                            </div>
                            <div><button>Подробнее</button></div>
                        </li>
                    )
                })}
            </ul>
        )
    }

    return (<>
        <div className={`${css["title"]}`}>
            <div className={`${css["summary"]}`}></div>
            <p>Список проживающих</p>
            <div className={`${css["filter"]}`}></div>
        </div>
        <div className={`${css["list"]}`}>
            {showResidents()}
        </div>
    </>);
}