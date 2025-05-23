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

    const [ openedProfileId, setOpenedProfileId ] = useState(null)
    const [ headerTotal, setHeaderTotal ] = useState({"total": 0, "inside": 0, "school": 0})
    const [ sortParams, setSortParams ] = useSort()

    // Get initial sort params
    useEffect(() => {
        let profile = searchParams.get("profile")
        if (profile && Number(profile)) {
            setOpenedProfileId(Number(profile))
        }

        let filter = searchParams.get("q")
        if (filter) {
            setSortParams({type: "FILTER", payload: filter})
        }

        let direction = searchParams.get("dir")
        if (direction) {
            setSortParams({type: "DIRECTION", payload: direction})
        }

        let sort = searchParams.get("sort")
        if (sort) {
            setSortParams({type: "SORT", payload: sort})
        }
    }, [])
    
    return (<>
        <ProfileContext.Provider value={setOpenedProfileId}>
            <Profile openedProfileId={openedProfileId} setOpenedProfileId={setOpenedProfileId} setSortParams={setSortParams}/>
            <Header sortParams={sortParams} setSortParams={setSortParams} total={headerTotal}/>
            <List sortParams={sortParams} setTotal={setHeaderTotal}/>
        </ProfileContext.Provider>
    </>);
}