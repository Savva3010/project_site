"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/applications/leave/list.module.css"

import { useEffect, useState, useReducer, useMemo } from 'react';

import useLoader from '@/lib/loader';
import useDefaultWebsocket from '@/lib/websocket';

import CustomServerError from '@/lib/customServerError';

import { location } from '@/enums';

import ListEl from './list-el';

import unixToString from '@/lib/unixToString';

import { SERVER_URL, WS_SERVER_URL } from '@/globals';

function recalcTotal(applications, setTotal) {
    let total = applications.length
    let inside = applications.filter(resident => resident?.status?.status === "inside" || resident?.status?.status === "isolator").length
    let school = applications.filter(resident => resident?.status?.status != "outside").length

    setTotal({"total": total, "inside": inside, "school": school})
}

export default function List({ sortParams, setTotal }) {

    const [ applications, setApplications ] = useLoader()

    // Connect to websocket
    const {sendJsonMessage, lastJsonMessage, readyState} = useDefaultWebsocket()

    // Handle websocket messages
    useEffect(() => {
        let op = lastJsonMessage?.op
        let ws_data = lastJsonMessage?.data
        if (!op || !lastJsonMessage.path) return

        if (lastJsonMessage.path === "/applications/leave") {

        }
    }, [lastJsonMessage])

    // Filtered and sorted applications
    const processedApplications = useMemo(() => {
        let currTime = Date.now()
        
        let sorted = applications.data
        if (!sorted) return []

        if (sortParams.filter != "") {
            sorted = sorted.filter(application => (`${application.room?.toLowerCase()} ${application.full_name?.toLowerCase()} ${application.class?.toLowerCase()} ${unixToString(application.leave)} ${unixToString(application.return)} ${application.address?.toLowerCase()} ${application.accompany?.toLowerCase()}`).includes(sortParams.filter.toLowerCase()))
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
            // TODO: make status sort
            const priority = {
                "review": 0,
                "accepted": 1,
                "active": 2,
                "denied": 3,
                "cancelled": 4,
                "expired": 5
            }
            
            sorted.sort((a, b) => {
                let l = priority[a.status]
                if (a.status === "accepted") {
                    if (a.return < currTime) {
                        l = priority["expired"]
                    } else if (a.leave < currTime) {
                        l = priority["active"]
                    }
                }

                let r = priority[b.status]
                if (b.status === "accepted") {
                    if (b.return < currTime) {
                        r = priority["expired"]
                    } else if (b.leave < currTime) {
                        r = priority["active"]
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
    }, [applications, sortParams])

    // Fetch applications
    useEffect(() => {
        setApplications({type: "LOADING"})
        let controller = new AbortController()
        fetch(SERVER_URL + "/applications/leave", {
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
            setApplications({type: "SUCCESS", payload: data.data})

            recalcTotal(data.data, setTotal)
        })
        .catch(err => {
            if (err.name === "AbortError") return
            console.error(err)
            setApplications({type: "ERROR", payload: err})
        })

        return () => {
            controller.abort()
        }
    }, [])

    // Show component
    function showApplications() {
        if (applications.status === "INITIALIZE") return <></>
        if (applications.status === "LOADING") {
            return <p className={`${css["loading"]}`}>Загружаем список . . .</p>
        }
        if (applications.status === "ERROR") {
            return <p style={{whiteSpace: "pre-wrap", height: "max-content"}} className={`${css["error"]}`}>Произошла ошибка (да, и такое бывает) ¯\_(ツ)_/¯ 
                <br/>
                Обратитесь к специалисту и попробуйте позже
                <br/>
                <br/>                           
                {applications.error.name}
                <br/>
                {applications.error.message}
                <br/>
                {applications.error.stack}
            </p>
        }
        if (applications.data.length === 0) {
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
                    <div><p><b>Сопровождающие</b></p></div>
                    <div><p><b>Статус</b></p></div>
                    <div></div>
                </li>
                {processedApplications.map((application) => {
                    return (
                        <ListEl key={application["id"]} info={application}/>
                    )
                })}
            </ul>
        )
    }

    return (<>
        <div className={`${css["list"]}`}>
            {showApplications()}
        </div>
    </>);
}