"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/journals/leave/list.module.css"

import { useEffect, useState, useReducer, useMemo } from 'react';

import useLoader from '@/lib/loader';
import useDefaultWebsocket from '@/lib/websocket';

import CustomServerError from '@/lib/customServerError';

import { location } from '@/enums';

import ListEl from './list-el';

import unixToString from '@/lib/unixToString';

import { SERVER_URL, WS_SERVER_URL } from '@/globals';

function recalcTotal(records, setTotal) {
    let total = records.length
    let inside = records.filter(resident => resident?.status?.status === "inside" || resident?.status?.status === "isolator").length
    let school = records.filter(resident => resident?.status?.status != "outside").length

    setTotal({"total": total, "inside": inside, "school": school})
}

export default function List({ sortParams, setTotal, listCategory }) {

    const [ records, setRecords ] = useLoader()

    // Connect to websocket
    const {sendJsonMessage, lastJsonMessage, readyState} = useDefaultWebsocket()

    // Handle websocket messages
    useEffect(() => {
        let op = lastJsonMessage?.op
        let ws_data = lastJsonMessage?.data
        if (!op || !lastJsonMessage.path) return

        if (lastJsonMessage.path === "/journals/leave") {
            if (op === "status:update") {
                let newRecords = [...records.data]
                let foundRecord = newRecords.findIndex(app => app.id === ws_data.id)
                if (foundRecord === -1) return
                newRecords[foundRecord].status = ws_data.status
                setRecords({type: "SUCCESS", payload: newRecords})
            }
        }
    }, [lastJsonMessage])

    // Filtered and sorted records
    const processedRecords = useMemo(() => {
        let currTime = Date.now()
        
        let sorted = records.data
        if (!sorted) return []

        if (sortParams.filter != "") {
            sorted = sorted.filter(record => (`${record.room?.toLowerCase()} ${record.full_name?.toLowerCase()} ${record.class?.toLowerCase()} ${unixToString(record.leave)} ${unixToString(record.return)} ${record.address?.toLowerCase()}`).includes(sortParams.filter.toLowerCase()))
        }

        sorted = sorted.filter(record => record.type === listCategory)

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
        } else if (sortParams.sort === "leave") {
            sorted.sort((a, b) => {
                let l = a.leave
                let r = b.leave
                if (l > r) return 1
                if (l < r) return -1
                return 0
            })
        } else if (sortParams.sort === "return") {
            sorted.sort((a, b) => {
                let l = a.return
                let r = b.return
                if (l > r) return 1
                if (l < r) return -1
                return 0
            })
        } else {
            const priority = {
                "inside": 0,
                "late_30": 1,
                "late": 2,
                "outside": 3,
                "school": 4,
                "returned": 5,
            }
            
            sorted.sort((a, b) => {
                let l = priority[a.status]
                if (a.status === "outside" || a.status === "school") {
                    if (a.return < currTime) {
                        if (currTime - a.return >= 30 * 60 * 1000) {
                            l = priority["late_30"]
                        } else {
                            l = priority["late"]
                        }
                    }
                }

                let r = priority[b.status]
                if (b.status === "outside" || b.status === "school") {
                    if (b.return < currTime) {
                        if (currTime - b.return >= 30 * 60 * 1000) {
                            r = priority["late_30"]
                        } else {
                            r = priority["late"]
                        }
                    }
                }

                if (l > r) return 1
                if (l < r) return -1
                return 0
            })
        }

        if (sortParams.direction === "up") {
            sorted.reverse()
        }

        return sorted
    }, [records, sortParams, listCategory])

    // Fetch records
    useEffect(() => {
        setRecords({type: "LOADING"})
        let controller = new AbortController()
        fetch(SERVER_URL + "/journals/leave", {
            method: "GET",
            headers: {
                "Key": "Authorization",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("AUTH_TOKEN"))}`
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
            setRecords({type: "SUCCESS", payload: data.data})

            recalcTotal(data.data, setTotal)
        })
        .catch(err => {
            if (err.name === "AbortError") return
            console.error(err)
            setRecords({type: "ERROR", payload: err})
        })

        return () => {
            controller.abort()
        }
    }, [])

    // Show component
    function showRecords() {
        if (records.status === "INITIALIZE") return <></>
        if (records.status === "LOADING") {
            return <p className={`${css["loading"]}`}>Загружаем список . . .</p>
        }
        if (records.status === "ERROR") {
            return <p style={{whiteSpace: "pre-wrap", height: "max-content"}} className={`${css["error"]}`}>Произошла ошибка (да, и такое бывает) ¯\_(ツ)_/¯ 
                <br/>
                Обратитесь к специалисту и попробуйте позже
                <br/>
                <br/>                           
                {records.error.name}
                <br/>
                {records.error.message}
                <br/>
                {records.error.stack}
            </p>
        }
        if (records.data.length === 0) {
            return <p className={`${css["empty"]}`}>Заялений нет, меньше работы ^_^</p>
        }

        return (
            <ul>

                <li className={`${css["list-header"]}`}>
                    <div><p><b>№</b></p></div>
                    <div><p><b>ФИО</b></p></div>
                    <div><p><b>Время выхода</b></p></div>
                    <div><p><b>Время входа</b></p></div>
                    <div><p><b>Адрес</b></p></div>
                    <div><p><b>Статус</b></p></div>
                    <div></div>
                </li>
                {processedRecords.map((record) => {
                    return (
                        <ListEl key={record["id"]} info={record}/>
                    )
                })}
            </ul>
        )
    }

    return (<>
        <div className={`${css["list"]}`}>
            {showRecords()}
        </div>
    </>);
}