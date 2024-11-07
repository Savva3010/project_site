"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/profile.module.css"

import { useEffect, useState, useReducer } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { location } from '@/enums';

import Column1 from './column1';
import Column2 from './column2';
import Column3 from './column3';

import { SERVER_URL } from '@/globals';

function useLoader() {
    const INITIAL_STATE = {
        status: "INITIALIZE",
        data: null,
        error: null
    }

    function reducer(state, { type, payload }) {
        switch (type) {
            case "INITIALIZE":
                return INITIAL_STATE
            case "LOADING":
                return {...state, status: "LOADING"}
            case "ERROR":
                return {...state, status: "ERROR", error: payload}
            case "SUCCESS":
                return {...state, status: "SUCCESS", data: payload}
            default:
                return {...state}
        }
    }

    return useReducer(reducer, INITIAL_STATE) 
}

export default function Profile({ openedProfileId, setOpenedProfileId }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [ resident, setResident ] = useLoader()

    const [ column3AddPanel, setColumn3AddPanel ] = useState(null)

    function closePanel() {
        setOpenedProfileId(null)
        let newParams = new URLSearchParams(searchParams.toString())
        newParams.delete("profile")
        router.replace(`/residents/?${newParams.toString()}`, undefined, {shallow: true})
    }

    useEffect(() => {
        if (openedProfileId == null) {
            setResident({type: "INITIALIZE"})
            setColumn3AddPanel(null)
            return
        }
        setResident({type: "LOADING"})
        let controller = new AbortController()
        fetch(SERVER_URL + "/residents/" + openedProfileId, {
            method: "GET",
            header: {

            },
            signal: controller.signal
        })
        .then(res => res.json())
        .then(data => {
            setResident({type: "SUCCESS", payload: data.data})
        })
        .catch(err => {
            if (err.name == "AbortError") return
            console.error(err)
            setResident({type: "ERROR", payload: err})
        })

        return () => {
            controller.abort()
        }
    }, [openedProfileId])

    function showResident() {
        if (resident.status == "ERROR") {
            return <p style={{whiteSpace: "pre-wrap", height: "100%"}} className={`${css["error"]}`}>Произошла ошибка (да, и такое бывает) ¯\_(ツ)_/¯ 
                <br/>
                Обратитесь к специалисту и попробуйте позже
                <br/>
                <br/>                           
                {resident.error.name}
                <br/>
                {resident.error.message}
                <br/>
                {resident.error.stack}
            </p>
        }

        return (<>
                <Column1 info={resident.data} />
                <Column2 info={resident.data} />
                <Column3 info={resident.data} setAddPanel={setColumn3AddPanel}/>
        </>)
    }
    return (<>
        {openedProfileId == null ?
            <></> :

            <>
                <div className={`${css["disable-bg"]}`} onClick={closePanel}></div>
                <div className={`${css["wrapper"]}`}>
                    <button className={`${css["close"]}`} onClick={closePanel}>
                        <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M30 27.6154L2.25745 2M29.2927 2.38462L0.999999 28" stroke="#AAAAAA" strokeWidth="3"/>
                        </svg>
                    </button>

                    {resident.status != "LOADING" ?
                    <></> :

                    <div className={`${css["disable-profile-bg"]}`}>
                        <p>Загрузка...</p>
                    </div>
                    }

                    {column3AddPanel == null ?
                    <></> :

                    <div className={`${css["disable-profile-bg"]}`} onClick={() => setColumn3AddPanel(null)}>
                        
                    </div>
                    }

                    <div className={`${css["profile"]}`}>
                        {showResident()}
                    </div>
                </div>
            </>
        }
    </>);
}