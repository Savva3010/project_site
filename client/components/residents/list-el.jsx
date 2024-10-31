"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/list.module.css"

import { useEffect, useState, useReducer, useContext } from 'react';

import { location } from '@/enums';

import { ProfileContext } from '@/residents/page';

export default function ListEl({ info }) {

    const setOpenedProfileId = useContext(ProfileContext)

    function openProfile() {
        setOpenedProfileId(info.id)
    }

    console.log("RENDER-EL", info.id)

    return (<>
        <li>
            <div><p>{info["room"]}</p></div>
            <div><p>{info["full_name"] + " " + info["class"]}</p></div>
            <div><p>{info["mobile"]}</p></div>
            <div><p>{info["email"]}</p></div>
            <div><p>{info["telegram"]}</p></div>
            <div className={`${css[`status-${location.getInfo(info.status.status)[1]}`]}`}>
                <p>{location.getInfo(info.status.status)[0]}</p>
            </div>
            <div><button onClick={openProfile}>Подробнее</button></div>
        </li>
    </>);
}