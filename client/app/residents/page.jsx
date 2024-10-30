"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/page.module.css"

import { useEffect, useState, useReducer, useRef } from 'react';

import { location } from '@/enums';

import List from "@/cmponents/residents/list"
import Profile from '@/cmponents/residents/profile';

export default function Residents() {

    const openedProfileId = useRef(null)
    
    return (<>
        <Profile id={openedProfileId} />
        <div className={`${css["title"]}`}>
            <div className={`${css["summary"]}`}></div>
            <p>Список проживающих</p>
            <div className={`${css["filter"]}`}></div>
        </div>
        <List openedProfileId={openedProfileId}/>
    </>);
}