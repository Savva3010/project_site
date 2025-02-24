"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/rooms/room.module.css"

import { useEffect, useState, useReducer } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useLoader from '@/lib/loader';

import CustomServerError from '@/lib/customServerError';

import useDefaultWebsocket from '@/lib/websocket';

import { location } from '@/enums';

import { SERVER_URL } from '@/globals';

import Resident from './resident';

export default function Room({ openedRoomId, setOpenedRoomId }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [ room, setRoom ] = useLoader()

    // Connect to websocket
    const {sendJsonMessage, lastJsonMessage, readyState} = useDefaultWebsocket()

    // Handle websocket messages
    useEffect(() => {
        let op = lastJsonMessage?.op
        let ws_data = lastJsonMessage?.data
        if (!op || !lastJsonMessage) return

        if (lastJsonMessage.path === "/residents") {
            if (op === "status:update") {
                let found = room.data.residents.findIndex(resident => resident.id === ws_data.id)
                if (found === -1) return
                let newResidents = [...room.data.residents]
                newResidents[found].status = ws_data.status
                setRoom({type: "SUCCESS", payload: {...room.data, residents: newResidents}})
            }
        }
    }, [lastJsonMessage])

    // Close modal
    function closePanel() {
        setOpenedRoomId(null)
        setRoom({type: "INITIALIZE"})
        let newParams = new URLSearchParams(searchParams.toString())
        newParams.delete("room")
        router.replace(`/rooms/?${newParams.toString()}`, { scroll: false })
    }

    // Fetch room
    useEffect(() => {
        if (openedRoomId === null) return
        setRoom({type: "LOADING"})
        let controller = new AbortController()
        fetch(SERVER_URL + "/rooms/" + openedRoomId, {
            method: "GET",
            headers: {
                "Key": "Authorization",
                "Value": `Bearer ${JSON.parse(localStorage.getItem("AUTH_TOKEN"))}`
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
            setRoom({type: "SUCCESS", payload: data.data})
        })
        .catch(err => {
            if (err.name === "AbortError") return
            console.error(err)
            setRoom({type: "ERROR", payload: err})
        })

        return () => {
            controller.abort()
        }
    }, [openedRoomId])

    // Show modal content
    function showRoom() {
        if (room.status === "ERROR") {
            return <p style={{whiteSpace: "pre-wrap", height: "100%"}} className={`${css["error"]}`}>Произошла ошибка (да, и такое бывает) ¯\_(ツ)_/¯ 
                <br/>
                Обратитесь к специалисту и попробуйте позже
                <br/>
                <br/>                           
                {room.error.name}
                <br/>
                {room.error.message}
                <br/>
                {room.error.stack}
            </p>
        }

        if (room.status != "SUCCESS") {
            return (<></>)
        }

        if (room.data.residents.length === 0) {
            return (<>
                <p className={`${css["no-residents"]}`}>Пусто. Здесь никто не живёт</p>
            </>)
        }

        return (<>
            {room.data.residents.map((resident, idx) => {
                return <Resident key={idx} info={resident} />
            })}
        </>)
    }
    return (<>
        {openedRoomId === null ?
            <></> :

            <>
                <div className={`${css["disable-page-bg"]}`} onClick={closePanel}></div>
                <div className={`${css["wrapper"]}`}>

                    <button className={`${css["close"]}`} onClick={closePanel}>
                        <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M30 27.6154L2.25745 2M29.2927 2.38462L0.999999 28" stroke="#AAAAAA" strokeWidth="3"/>
                        </svg>
                    </button>

                    {room.status != "LOADING" ?
                    <>
                        <p className={`${css["room-number"]}`}><b>Комната {room.data?.room_number ? room.data.room_number : <>&minus;</>}</b></p>
                    </> :

                    <>
                        <div className={`${css["disable-room-bg"]}`}></div>
                        <p className={`${css["loading-text"]}`}><b>Загрузка...</b></p>
                    </>
                    }


                    <div className={`${css["room"]}`}>
                        {showRoom()}
                    </div>
                </div>
            </>
        }
    </>);
}