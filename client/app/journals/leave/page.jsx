"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/journals/leave/page.module.css"

import { useEffect, useState, useReducer, useRef, createContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { location } from '@/enums';

import List from "@/components/journals/leave/list"
import AddRecord from '@/components/journals/leave/add-record';
import Record from '@/components/journals/leave/record/record';
import Header from '@/components/journals/leave/header';

export const RecordContext = createContext(null)

function useSort() {
    const INITIAL_STATE = {
        filter: "",
        direction: "down",
        sort: "leave"
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

export default function Records() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [ openedRecordId, setOpenedRecordId ] = useState(null)
    const [ addRecordOpened, setAddRecordOpened ] = useState(false)
    const [ listCategory, setListCategory ] = useState("self")
    const [ headerTotal, setHeaderTotal ] = useState({"total": 0, "inside": 0, "school": 0})
    const [ sortParams, setSortParams ] = useSort()

    // Get initial sort params
    useEffect(() => {
        let app = searchParams.get("app")
        if (app && Number(app)) {
            setOpenedRecordId(Number(app))
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
        <RecordContext.Provider value={setOpenedRecordId}>
            {!addRecordOpened ?
            <></> :

            <AddRecord modalInfo={addRecordOpened} setModalInfo={setAddRecordOpened}/>
            }

            <Record openedRecordId={openedRecordId} setOpenedRecordId={setOpenedRecordId} setSortParams={setSortParams}/>
            <Header sortParams={sortParams} setSortParams={setSortParams} total={headerTotal} addRecord={() => setAddRecordOpened(true)} listCategory={listCategory} setListCategory={setListCategory}/>
            <List listCategory={listCategory} sortParams={sortParams} setTotal={setHeaderTotal}/>
        </RecordContext.Provider>
    </>);
}