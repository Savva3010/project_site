"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/applications/leave/list.module.css"

import { useEffect, useState, useReducer, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import unixToString from '@/lib/unixToString';

import { application_leave_status } from '@/enums';

import { ApplicationContext } from '@/applications/leave/page';

export default function ListEl({ info }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const setOpenedApplicationId = useContext(ApplicationContext)

    const leave_date = info?.leave && unixToString(new Date(info["leave"])).split(" ") || []
    const return_date = info?.return && unixToString(new Date(info["return"])).split(" ") || []

    // Open application modal
    function openApplication() {
        setOpenedApplicationId(info.id)
        let newParams = new URLSearchParams(searchParams.toString())
        newParams.set("app", info.id)
        router.replace(`/applications/leave/?${newParams.toString()}`, { scroll: false })
    }

    return (<>
        <li className={`${application_leave_status.getInfo(info.status)[1] === "expired" ? css[`list-el-expired`] : ""}`}>
            <div><p>{info?.room ? info["room"] : <b>&minus;</b>}</p></div>
            <div><p>{info?.full_name ? `${info["full_name"]} ${info?.class}` : <b>&minus;</b>}</p></div>
            <div>{info?.leave ? <>
                <p>{leave_date[0]}</p>
                <svg width="2" height="20" viewBox="0 0 2 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" width="1" height="20" rx="0.5" fill="black"/>
                </svg>
                <p>{leave_date[1]}</p>
            </> : <p><b>&minus;</b></p>}</div>
            <div>{info?.return ?  <>
                <p>{return_date[0]}</p>
                <svg width="2" height="20" viewBox="0 0 2 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" width="1" height="20" rx="0.5" fill="black"/>
                </svg>
                <p>{return_date[1]}</p>
            </> : <p><b>&minus;</b></p>}</div>
            <div><p>{info?.address ? info["address"] : <b>&minus;</b>}</p></div>
            <div><p>{info?.accompany ? info["accompany"] : <b>&minus;</b>}</p></div>
            <div className={`${css[`status-${application_leave_status.getInfo(info.status)[1]}`]}`}>
                <p>{application_leave_status.getInfo(info.status)[0]}</p>
            </div>
            <div><button onClick={openApplication}>Подробнее</button></div>
        </li>
    </>);
}