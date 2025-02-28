"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/rooms/list.module.css"

import { useEffect, useState, useReducer, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { location } from '@/enums';

import { RoomContext } from '@/rooms/page';

export default function ListEl({ info }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const setOpenedRoomId = useContext(RoomContext)

    // Open room modal
    function openRoom() {
        setOpenedRoomId(info.room_number)
        let newParams = new URLSearchParams(searchParams.toString())
        newParams.set("room", info.room_number)
        router.replace(`/rooms/?${newParams.toString()}`, { scroll: false })
    }

    return (<>
        <li>
            <div><p>{info?.room_number ? info["room_number"] : <b>&minus;</b>}</p></div>
            <div><p>{info?.residents[0]?.full_name ? `${info["residents"][0]["full_name"]} ${info?.residents[0].class}` : <b>&minus;</b>}</p></div>
            <div><p>{info?.residents[1]?.full_name ? `${info["residents"][1]["full_name"]} ${info?.residents[1].class}` : <b>&minus;</b>}</p></div>
            <div><p>{info?.residents[2]?.full_name ? `${info["residents"][2]["full_name"]} ${info?.residents[2].class}` : <b>&minus;</b>}</p></div>
            <div><button onClick={openRoom}>Подробнее</button></div>
        </li>
    </>);
}