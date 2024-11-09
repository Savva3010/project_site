"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/list.module.css"

import { useEffect, useState, useReducer, useMemo } from 'react';

import { location } from '@/enums';

import ListEl from './list-el';

import { SERVER_URL } from '@/globals';

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

export default function List({ sortParams, setTotal }) {

    const [ residents, setResidents ] = useLoader()

    const processedResidents = useMemo(() => {
        let sorted = residents.data
        if (!sorted) return []

        if (sortParams.filter != "") {
            sorted = sorted.filter(resident => resident.full_name.toLowerCase().includes(sortParams.filter.toLowerCase()))
        }

        if (sortParams.sort == "full_name") {
            sorted.sort((a, b) => {
                let l = a.full_name
                let r = b.full_name
                if (l > r) return 1
                if (l < r) return -1
                return 0
            })
        } else if (sortParams.sort == "room") {
            sorted.sort((a, b) => {
                let l = a.room
                let r = b.room

                if (l > r) return 1
                if (l < r) return -1
                return 0
            })
        } else {
            const priority = {
                "inside": 0,
                "isolator": 1,
                "school": 2,
                "outside": 3
            }

            sorted.sort((a, b) => {
                let l = priority[a.status.status]
                let r = priority[b.status.status]

                if (l > r) return 1
                if (l < r) return -1
                return 0
            })
        }

        if (sortParams.direction == "up") {
            sorted.reverse()
        }

        return sorted
    }, [residents, sortParams])

    useEffect(() => {
        setResidents({type: "LOADING"})
        let controller = new AbortController()
        fetch(SERVER_URL + "/residents", {
            method: "GET",
            header: {

            },
            signal: controller.signal
        })
        .then(res => res.json())
        .then(data => {
            setResidents({type: "SUCCESS", payload: data.data})

            let total = data.data.length
            let inside = data.data.filter(resident => resident?.status?.status == "inside").length
            let school = data.data.filter(resident => resident?.status?.status == "school").length

            setTotal({"total": total, "inside": inside, "school": school})
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

                <li className={`${css["list-header"]}`}>
                        <div><p><b>№</b></p></div>
                        <div><p><b>ФИО</b></p></div>
                        <div><p><b>Номер тел.</b></p></div>
                        <div><p><b>Почта</b></p></div>
                        <div><p><b>Telegram</b></p></div>
                        <div><p><b>Статус</b></p></div>
                        <div></div>
                </li>
                {processedResidents.map((resident) => {
                    return (
                        <ListEl key={resident["id"]} info={resident}/>
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