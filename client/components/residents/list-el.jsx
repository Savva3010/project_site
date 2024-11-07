"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/list.module.css"

import { useEffect, useState, useReducer, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { location } from '@/enums';

import { ProfileContext } from '@/residents/page';

export default function ListEl({ info }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const setOpenedProfileId = useContext(ProfileContext)

    function openProfile() {
        setOpenedProfileId(info.id)
        let newParams = new URLSearchParams(searchParams.toString())
        newParams.append("profile", info.id)
        router.replace(`/residents/?${newParams.toString()}`, undefined, {shallow: true})
    }

    console.log("RENDER-EL", info.id)

    return (<>
        <li>
            <div><p>{info?.room ? info["room"] : <b>&minus;</b>}</p></div>
            <div><p>{info?.full_name ? info["full_name"] : <b>&minus;</b>}</p></div>
            <div><p>{info?.mobile ? info["mobile"] : <b>&minus;</b>}</p></div>
            <div><p>{info?.email ? info["email"] : <b>&minus;</b>}</p></div>
            <div><p>{info?.telegram ? info["telegram"] : <b>&minus;</b>}</p></div>
            <div className={`${css[`status-${location.getInfo(info.status.status)[1]}`]}`}>
                <p>{location.getInfo(info.status.status)[0]}</p>
            </div>
            <div><button onClick={openProfile}>Подробнее</button></div>
        </li>
    </>);
}