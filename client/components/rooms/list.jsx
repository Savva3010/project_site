"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/rooms/list.module.css"

import { useEffect, useState, useReducer, useMemo } from 'react';

import useLoader from '@/lib/loader';

import CustomServerError from '@/lib/customServerError';

import { location } from '@/enums';

import ListEl from './list-el';

import { SERVER_URL, WS_SERVER_URL } from '@/globals';

export default function List({ sortParams, setTotal }) {

    const [ rooms, setRooms ] = useLoader()

    // Filtered rooms
    const processedRooms = useMemo(() => {
        let sorted = rooms.data
        if (!sorted) return []

        if (sortParams.filter != "") {
            sorted = sorted.filter(room => (`${room.room_number?.toLowerCase()} ${room.residents[0]?.full_name?.toLowerCase()} ${room.residents[0]?.class?.toLowerCase()} ${room.residents[1]?.full_name?.toLowerCase()} ${room.residents[1]?.class?.toLowerCase()} ${room.residents[2]?.full_name?.toLowerCase()} ${room.residents[2]?.class?.toLowerCase()}`).includes(sortParams.filter.toLowerCase()))
        }

        sorted.sort((a, b) => {
            let l = a.room_number
            let r = b.room_number

            if (l > r) return 1
            if (l < r) return -1
            return 0
        })

        if (sortParams.direction === "up") {
            sorted.reverse()
        }

        return sorted
    }, [rooms, sortParams])

    // Fetch rooms
    useEffect(() => {
        setRooms({type: "LOADING"})
        let controller = new AbortController()
        fetch(SERVER_URL + "/rooms", {
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
            setRooms({type: "SUCCESS", payload: data.data})

            let total = data.data.length
            let inside = data.data.filter(resident => resident?.status?.status === "inside").length
            let school = data.data.filter(resident => resident?.status?.status === "school").length

            setTotal({"total": total, "inside": inside, "school": school})
        })
        .catch(err => {
            if (err.name === "AbortError") return
            console.error(err)
            setRooms({type: "ERROR", payload: err})
        })

        return () => {
            controller.abort()
        }
    }, [])

    // Show component
    function showRooms() {
        if (rooms.status === "INITIALIZE") return <></>
        if (rooms.status === "LOADING") {
            return <p className={`${css["loading"]}`}>Загружаем список . . .</p>
        }
        if (rooms.status === "ERROR") {
            return <p style={{whiteSpace: "pre-wrap", height: "max-content"}} className={`${css["error"]}`}>Произошла ошибка (да, и такое бывает) ¯\_(ツ)_/¯ 
                <br/>
                Обратитесь к специалисту и попробуйте позже
                <br/>
                <br/>                           
                {rooms.error.name}
                <br/>
                {rooms.error.message}
                <br/>
                {rooms.error.stack}
            </p>
        }
        if (rooms.data.length === 0) {
            return <p className={`${css["empty"]}`}>Комнат нет. А куда пропало здание то? (⊙﹏⊙)</p>
        }

        return (
            <ul>

                <li className={`${css["list-header"]}`}>
                        <div><p><b>№</b></p></div>
                        <div><p><b>ФИО</b></p></div>
                        <div><p><b>ФИО</b></p></div>
                        <div><p><b>ФИО</b></p></div>
                        <div></div>
                </li>
                {processedRooms.map((room) => {
                    return (
                        <ListEl key={room["room_number"]} info={room}/>
                    )
                })}
            </ul>
        )
    }

    return (<>
        <div className={`${css["list"]}`}>
            {showRooms()}
        </div>
    </>);
}