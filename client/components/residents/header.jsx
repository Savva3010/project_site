"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/header.module.css"

import { useEffect, useState, useReducer, useRef, createContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { location } from '@/enums';

export default function Header({sortParams, setSortParams, total}) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [openedProfileId, setOpenedProfileId] = useState(null)

    // Change direction of sort
    function changeDirection() {
        let newDir = sortParams.direction === "down" ? "up" : "down"
        let newParams = new URLSearchParams(searchParams.toString())
        newParams.set("dir", newDir)
        if (newDir === "down") {
            newParams.delete("dir")
        }
        router.replace(`/residents/?${newParams.toString()}`, { scroll: false })
        setSortParams({type: "DIRECTION", payload: newDir})
    }
    
    // Change sort column
    function changeSort(sortCategory) {
        return () => {
            let newParams = new URLSearchParams(searchParams.toString())
            newParams.set("sort", sortCategory)
            if (sortCategory === "room") {
                newParams.delete("sort")
            }
            router.replace(`/residents/?${newParams.toString()}`, { scroll: false })
            setSortParams({type: "SORT", payload: sortCategory})
        }
    }

    // Change filter query
    function changeFilter(event) {
        let val = event.target.value
        val = val.replaceAll(/ {2,}/gi, " ")
        val = val.replaceAll(/[^@_/+.\-a-zA-Zа-яА-Я0-9 ]/g, "")
        let newParams = new URLSearchParams(searchParams.toString())
        newParams.set("q", val)
        if (val === "") {
            newParams.delete("q")
        }
        router.replace(`/residents/?${newParams.toString()}`, { scroll: false })
        setSortParams({type: "FILTER", payload: val})
    }

    return (<>
        <div className={`${css["header"]}`}>
            <div className={`${css["summary"]}`}>
                <p>В ФТЛ: {total.school}/{total.total}</p>
                <p>В интернате: {total.inside}/{total.total}</p>
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
                    <button className={`${sortParams.sort === "room"      ? css["sort-sort-selected"] : ""}`} onClick={changeSort("room")}>комната</button>
                    <button className={`${sortParams.sort === "full_name" ? css["sort-sort-selected"] : ""}`} onClick={changeSort("full_name")}>ФИО</button>
                    <button className={`${sortParams.sort === "status"    ? css["sort-sort-selected"] : ""}`} onClick={changeSort("status")}>статус</button>
                </div>
            </div>
        </div>
    </>);
}