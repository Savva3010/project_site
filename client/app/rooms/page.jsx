"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/rooms/page.module.css"

import { useEffect, useState, useReducer, useRef, createContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { location } from '@/enums';

import List from "@/components/rooms/list"
import Room from '@/components/rooms/room/room';
import Header from '@/components/rooms/header';

export const RoomContext = createContext(null)

function useSort() {
    const INITIAL_STATE = {
        filter: "",
        direction: "down",
    }

    function reducer(state, { type, payload }) {
        switch (type) {
            case "FILTER":
                return {...state, filter: payload}
            case "DIRECTION":
                return {...state, direction: payload}
            default:
                return {...state}
        }
    }

    return useReducer(reducer, INITIAL_STATE)
}

export default function Rooms() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [ openedRoomId, setOpenedRoomId ] = useState(null)
    const [ headerTotal, setHeaderTotal ] = useState({"total": 0, "inside": 0, "school": 0})
    const [ sortParams, setSortParams ] = useSort()

    // Get initial sort params
    useEffect(() => {
        let room = searchParams.get("room")
        if (room) {
            setOpenedRoomId(room)
        }

        let filter = searchParams.get("q")
        if (filter) {
            setSortParams({type: "FILTER", payload: filter})
        }

        let direction = searchParams.get("dir")
        if (direction) {
            setSortParams({type: "DIRECTION", payload: direction})
        }

        let sort = searchParams.get("sort")
        if (sort) {
            setSortParams({type: "SORT", payload: sort})
        }
    }, [])
    
    return (<>
        <RoomContext.Provider value={setOpenedRoomId}>
            <Room openedRoomId={openedRoomId} setOpenedRoomId={setOpenedRoomId}/>
            <Header sortParams={sortParams} setSortParams={setSortParams} total={headerTotal}/>
            <List sortParams={sortParams} setTotal={setHeaderTotal}/>
        </RoomContext.Provider>
    </>);
}