"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/header.module.css"

import { useEffect, useState, useReducer, useRef, createContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { location } from '@/enums';

export default function Header({sortParams, setSortParams}) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [openedProfileId, setOpenedProfileId] = useState(null)

    useEffect(() => {
    }, [])

    function changeDirection() {
        setSortParams({type: "DIRECTION", payload: sortParams.direction == "down" ? "up" : "down"})
    }
    
    function changeSort(sortCategory) {
        return () => {
            setSortParams({type: "SORT", payload: sortCategory})
        }
    }

    function changeFilter(event) {
        let val = event.target.value
        val = val.replaceAll(/[^a-zA-Zа-яА-Я0-9]/gi, "")
        setSortParams({type: "FILTER", payload: val})
    }

    return (<>
        <div className={`${css["header"]}`}>
            <div className={`${css["summary"]}`}>
                <p>На территории: STATIC/STATIC</p>
                <p>В ФТЛ: STATIC/STATIC</p>
            </div>
            <p><b>Список проживающих</b></p>
            <div className={`${css["sort"]}`}>
                <div className={`${css["sort-filter"]}`}>
                    <input type="text" placeholder='Фильтр' value={sortParams.filter} onChange={changeFilter}/>
                    <button onClick={changeDirection}>
                        <span className={`bi bi-arrow-${sortParams.direction}`}></span>
                    </button>
                </div>
                <div className={`${css["sort-sort"]}`}>
                    <p>Сортировать по:</p>
                    <button className={`${sortParams.sort == "room"      ? css["sort-sort-selected"] : ""}`} onClick={changeSort("room")}>комната</button>
                    <button className={`${sortParams.sort == "full_name" ? css["sort-sort-selected"] : ""}`} onClick={changeSort("full_name")}>ФИО</button>
                    <button className={`${sortParams.sort == "status"    ? css["sort-sort-selected"] : ""}`} onClick={changeSort("status")}>статус</button>
                </div>
            </div>
        </div>
    </>);
}