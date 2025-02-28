"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/journals/leave/list.module.css"

import { useEffect, useState, useReducer, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import unixToString from '@/lib/unixToString';

import { journals_leave_status } from '@/enums';

import { RecordContext } from '@/journals/leave/page';

function getAdditionalClass(info, currTime) {
    if (journals_leave_status.getInfo(info.status)[1] === "returned") {
        return css[`list-el-returned`]
    }

    if (info.status === "outside" || info.status === "school") {
        if (info.return < currTime) {
            if (currTime - info.return >= 30 * 60 * 1000) {
                return css[`list-el-late-30`]
            } else {
                return css[`list-el-late`]
            }
        }
    }

    return ""
}

function minuteTextForm(lateness) {
    if (10 <= lateness % 100 && lateness % 100 <= 20) {
        return "минут"
    }
    if (lateness % 10 === 0 || 5 <= lateness % 10 && lateness % 10 <= 9) {
        return "минут"
    }
    if (lateness % 10 === 1) {
        return "минута"
    }
    return "минуты"
}

function getStatus(info, currTime) {
    if (info.status === "outside" || info.status === "school") {
        if (info.return < currTime) {
            let lateness = Math.floor((currTime - info.return) / 1000 / 60)
            return `Опоздание ${lateness} ${minuteTextForm(lateness)}`
        }
    }
    return journals_leave_status.getInfo(info.status)[0]
}

export default function ListEl({ info }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const setOpenedRecordId = useContext(RecordContext)

    const leave_date = info?.leave && unixToString(new Date(info["leave"])).split(" ") || []
    const marked_leave_date = info?.leave_marked && unixToString(new Date(info["leave_marked"])).split(" ") || []
    const return_date = info?.return && unixToString(new Date(info["return"])).split(" ") || []
    const marked_return_date = info?.return_marked && unixToString(new Date(info["return_marked"])).split(" ") || []

    let status = info?.status

    const currTime = Date.now()

    // Open record modal
    function openRecord() {
        setOpenedRecordId(info.id)
        let newParams = new URLSearchParams(searchParams.toString())
        newParams.set("app", info.id)
        router.replace(`/journals/leave/?${newParams.toString()}`, { scroll: false })
    }

    return (<>
        <li className={`${getAdditionalClass(info, currTime)} ${info.status != "inside" ? css["list-el-double"] : ""}`}>
            <div><p>{info?.room ? info["room"] : <b>&minus;</b>}</p></div>
            <div><p>{info?.full_name ? `${info["full_name"]} ${info?.class}` : <b>&minus;</b>}</p></div>
            <div>
                <div>
                    {info?.leave ? <>
                    <p>{leave_date[0]}</p>
                    <svg width="2" height="20" viewBox="0 0 2 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" width="1" height="20" rx="0.5" fill="black"/>
                    </svg>
                    <p>{leave_date[1]}</p>
                    
                    </> : <p><b>&minus;</b></p>
                    }
                </div>

                {info?.status != "inside" ? 
                <>
                <div className={`${css["double-el-hor-divider"]}`}></div>
                <div>
                    {info?.leave_marked ? <>
                    <p>{marked_leave_date[0]}</p>
                    <svg width="2" height="20" viewBox="0 0 2 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" width="1" height="20" rx="0.5" fill="black"/>
                    </svg>
                    <p>{marked_leave_date[1]}</p>
                    
                    </> : <p><b>&minus;</b></p>
                    }
                </div>
                </> :
                

                <></>
                }
            </div>
            <div>
                <div>
                    {info?.return ?  <>
                    <p>{return_date[0]}</p>
                    <svg width="2" height="20" viewBox="0 0 2 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" width="1" height="20" rx="0.5" fill="black"/>
                    </svg>
                    <p>{return_date[1]}</p>

                    </> : <p><b>&minus;</b></p>
                    }
                </div>

                {info?.status === "returned" ?
                <>
                <div className={`${css["double-el-hor-divider"]}`}></div>
                <div>
                    {info?.return_marked ?  <>
                    <p>{marked_return_date[0]}</p>
                    <svg width="2" height="20" viewBox="0 0 2 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" width="1" height="20" rx="0.5" fill="black"/>
                    </svg>
                    <p>{marked_return_date[1]}</p>
                    
                    </> : <p><b>&minus;</b></p>
                    }
                </div>
                </> :

                <></>
                }                
            </div>
            <div><p>{info?.address ? info["address"] : <b>&minus;</b>}</p></div>
            <div className={`${css[`status-${journals_leave_status.getInfo(status)[1]}`]}`}>
                <p>{getStatus(info, currTime)}</p>
            </div>
            <div><button onClick={openRecord}>Подробнее</button></div>
        </li>
    </>);
}