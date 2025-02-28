"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/rooms/header.module.css"

import { useEffect, useState, useReducer, useRef, createContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { location } from '@/enums';

export default function Header({sortParams, setSortParams, total}) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [openedProfileId, setOpenedProfileId] = useState(null)

    // Change sort direction
    function changeDirection() {
        let newDir = sortParams.direction === "down" ? "up" : "down"
        let newParams = new URLSearchParams(searchParams.toString())
        newParams.set("dir", newDir)
        if (newDir === "down") {
            newParams.delete("dir")
        }
        router.replace(`/rooms/?${newParams.toString()}`, { scroll: false })
        setSortParams({type: "DIRECTION", payload: newDir})
    }

    // Change filter query
    function changeFilter(event) {
        let val = event.target.value
        val = val.replaceAll(/ {2,}/gi, " ")
        val = val.replaceAll(/[^/a-zA-Zа-яА-Я0-9 ]/g, "")
        let newParams = new URLSearchParams(searchParams.toString())
        newParams.set("q", val)
        if (val === "") {
            newParams.delete("q")
        }
        router.replace(`/rooms/?${newParams.toString()}`, { scroll: false })
        setSortParams({type: "FILTER", payload: val})
    }

    return (<>
        <div className={`${css["header"]}`}>
            <div>
            </div>
            <p><b>Список комнат</b></p>
            <div className={`${css["sort"]}`}>
                <div className={`${css["sort-filter"]}`}>
                    <input type="text" placeholder='Фильтр' value={sortParams.filter} onChange={changeFilter}/>
                    <button onClick={changeDirection}>
                        <span className={`bi bi-arrow-${sortParams.direction}`}></span>
                    </button>
                </div>
            </div>
        </div>
    </>);
}