"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/page.module.css"

import { useEffect, useState, useReducer } from 'react';

import { location } from '@/enums';

export default function ListEl({ info, openedProfileId }) {

    function openProfile() {
        setOpenedProfileId(info.id)
    }

    console.log("RERENDER" + info.id)

    return (<>
        <li>
            <div>STATIC</div>
            <div>{info["full_name"]}</div>
            <div>{info["mobile"]}</div>
            <div>{info["email"]}</div>
            <div>{info["telegram"]}</div>
            <div className={`${css[`status-${location.getInfo(info.status.status)[1]}`]}`}>
                {location.getInfo(info.status.status)[0]}
            </div>
            <div><button onClick={() => openedProfileId.current = info.id}>Подробнее</button></div>
        </li>
    </>);
}