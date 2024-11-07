"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/page.module.css"

import { useEffect, useState, useReducer, useRef, createContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { location } from '@/enums';

import List from "@/components/residents/list"
import Profile from '@/components/residents/profile/profile';
import Header from '@/components/residents/header';

export const ProfileContext = createContext(null)

function useSort() {
    const INITIAL_STATE = {
        filter: "",
        direction: "down",
        sort: "room"
    }

    function reducer(state, { type, payload }) {
        switch (type) {
            case "FILTER":
                return {...state, filter: payload}
            case "DIRECTION":
                return {...state, direction: payload}
            case "SORT":
                return {...state, sort: payload}
            default:
                return {...state}
        }
    }

    return useReducer(reducer, INITIAL_STATE)
}

export default function Residents() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [openedProfileId, setOpenedProfileId] = useState(null)

    const [ sortParams, setSortParams ] = useSort()

    useEffect(() => {
        let profile = searchParams.get("profile")
        if (!profile || !Number(profile)) return

        setOpenedProfileId(Number(profile))
    }, [])
    
    return (<>
        <ProfileContext.Provider value={setOpenedProfileId}>
            <Profile openedProfileId={openedProfileId} setOpenedProfileId={setOpenedProfileId} />
            <Header sortParams={sortParams} setSortParams={setSortParams} />
            <List />
        </ProfileContext.Provider>
    </>);
}