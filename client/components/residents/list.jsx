"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/list.module.css"

import { useEffect, useState, useReducer, useMemo } from 'react';

import useLoader from '@/lib/loader';
import useDefaultWebsocket from '@/lib/websocket';

import CustomServerError from '@/lib/customServerError';

import { location } from '@/enums';

import ListEl from './list-el';

import { SERVER_URL, WS_SERVER_URL } from '@/globals';

function recalcTotal(residents, setTotal) {
    let total = residents.length
    let inside = residents.filter(resident => resident?.status?.status === "inside" || resident?.status?.status === "isolator").length
    let school = residents.filter(resident => resident?.status?.status != "outside").length

    setTotal({"total": total, "inside": inside, "school": school})
}

export default function List({ sortParams, setTotal }) {

    const [ residents, setResidents ] = useLoader()

    // Connect to websocket
    const {sendJsonMessage, lastJsonMessage, readyState} = useDefaultWebsocket("/residents")

    // Handle websocket messages
    useEffect(() => {
        let op = lastJsonMessage?.op
        let ws_data = lastJsonMessage?.data
        if (!op) return

        if (op === "ping") {
            sendJsonMessage({"op": "pong"})
        } else if (op === "status:update") {
            let newResidents = [...residents.data]
            let foundResident = newResidents.findIndex(resident => resident.id === ws_data.id)
            if (foundResident === -1) return
            newResidents[foundResident].status = ws_data.status
            setResidents({type: "SUCCESS", payload: newResidents})
            recalcTotal(newResidents, setTotal)
        }
    }, [lastJsonMessage])

    // Filtered and sorted residents
    const processedResidents = useMemo(() => {
        let sorted = residents.data
        if (!sorted) return []

        if (sortParams.filter != "") {
            sorted = sorted.filter(resident => (`${resident.room?.toLowerCase()} ${resident.full_name?.toLowerCase()} ${resident.class?.toLowerCase()} ${resident.mobile?.toLowerCase()}  ${resident.email?.toLowerCase()}  ${resident.telegram?.toLowerCase()}`).includes(sortParams.filter.toLowerCase()))
        }

        if (sortParams.sort === "full_name") {
            sorted.sort((a, b) => {
                let l = a.full_name
                let r = b.full_name
                if (l > r) return 1
                if (l < r) return -1
                return 0
            })
        } else if (sortParams.sort === "room") {
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

        if (sortParams.direction === "up") {
            sorted.reverse()
        }

        return sorted
    }, [residents, sortParams])

    // Fetch residents
    useEffect(() => {
        setResidents({type: "LOADING"})
        let controller = new AbortController()
        fetch(SERVER_URL + "/residents", {
            method: "GET",
            headers: {

            },
            signal: controller.signal
        })
        .then(res => {
            return res.json()
            .then(body => {
                if (res.status != 200 || !body || !body?.success) {
                    throw new CustomServerError(body.data.message)
                }
                return body
            })
        })
        .then(data => {
            setResidents({type: "SUCCESS", payload: data.data})

            recalcTotal(data.data, setTotal)
        })
        .catch(err => {
            if (err.name === "AbortError") return
            console.error(err)
            setResidents({type: "ERROR", payload: err})
        })

        return () => {
            controller.abort()
        }
    }, [])

    // Show component
    function showResidents() {
        if (residents.status === "INITIALIZE") return <></>
        if (residents.status === "LOADING") {
            return <p className={`${css["loading"]}`}>Загружаем список . . .</p>
        }
        if (residents.status === "ERROR") {
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
        if (residents.data.length === 0) {
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