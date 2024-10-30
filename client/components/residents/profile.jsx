"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/profile.module.css"

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

export default function Profile({ id }) {

    const [ resident, setResident ] = useLoader()

    useEffect(() => {
        if (id.current == null) {
            setResident({type: "INITIALIZE"})
            return
        }
        setResident({type: "LOADING"})
        let controller = new AbortController()
        fetch(URL + "/residents", {
            method: "GET",
            header: {

            },
            signal: controller.signal
        })
        .then(res => res.json())
        .then(data => {
            setResident({type: "SUCCESS", payload: data.data})
        })
        .catch(err => {
            if (err.name == "AbortError") return
            console.error(err)
            setResident({type: "ERROR", payload: err})
        })

        return () => {
            controller.abort()
        }
    }, [id.current])

    function showResident() {
        if (resident.status == "INITIALIZE") return <></>
        if (resident.status == "LOADING") {
            return <p className={`${css["loading"]}`}>Загружаем список . . .</p>
        }
        if (resident.status == "ERROR") {
            return <p style={{whiteSpace: "pre-wrap", height: "max-content"}} className={`${css["error"]}`}>Произошла ошибка (да, и такое бывает) ¯\_(ツ)_/¯ 
                <br/>
                Обратитесь к специалисту и попробуйте позже
                <br/>
                <br/>                           
                {resident.error.name}
                <br/>
                {resident.error.message}
                <br/>
                {resident.error.stack}
            </p>
        }
        if (resident.data.length == 0) {
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
                {resident.data.map((resident, idx) => {
                    return (<>
                        {id.current}
                    </>)
                })}
            </ul>
        )
    }

    return (<>
        {id.current == null ?
            <></> :

            <div className={`${css["profile-wrapper"]}`}>
                {showResident()}
            </div>
        }
    </>);
}