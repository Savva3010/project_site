"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/applications/leave/page.module.css"

import { useEffect, useState, useReducer, useRef, createContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { location } from '@/enums';

import List from "@/components/applications/leave/list"
import Application from '@/components/applications/leave/application/application';
import Header from '@/components/applications/leave/header';

export const ApplicationContext = createContext(null)

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

export default function Applications() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [ openedApplicationId, setOpenedApplicationId ] = useState(null)
    const [ headerTotal, setHeaderTotal ] = useState({"total": 0, "inside": 0, "school": 0})
    const [ sortParams, setSortParams ] = useSort()

    // Get initial sort params
    useEffect(() => {
        let app = searchParams.get("app")
        if (app && Number(app)) {
            setOpenedApplicationId(Number(app))
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
        <ApplicationContext.Provider value={setOpenedApplicationId}>
            <Application openedApplicationId={openedApplicationId} setOpenedApplicationId={setOpenedApplicationId}/>
            <Header sortParams={sortParams} setSortParams={setSortParams} total={headerTotal}/>
            <List sortParams={sortParams} setTotal={setHeaderTotal}/>
        </ApplicationContext.Provider>
    </>);
}