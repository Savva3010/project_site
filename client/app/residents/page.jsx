"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/page.module.css"

import { useEffect, useState, useReducer, useRef, createContext } from 'react';

import { location } from '@/enums';

import List from "@/cmponents/residents/list"
import Profile from '@/cmponents/residents/profile/profile';

export const ProfileContext = createContext(null)

export default function Residents() {

    const [openedProfileId, setOpenedProfileId] = useState(null)
    
    return (<>
        <ProfileContext.Provider value={setOpenedProfileId}>
            <Profile openedProfileId={openedProfileId} setOpenedProfileId={setOpenedProfileId} />
            <div className={`${css["title"]}`}>
                <div className={`${css["summary"]}`}></div>
                <p>РЎРїРёСЃРѕРє РїСЂРѕР¶РёРІР°СЋС‰РёС…</p>
                <div className={`${css["filter"]}`}></div>
            </div>
            <List />
        </ProfileContext.Provider>
    </>);
}