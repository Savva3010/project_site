"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/profile.module.css"

import { useEffect, useState, useReducer } from 'react';

import { location } from '@/enums';

import ProfileColumn1 from './profile-column1';

const URL = "http://localhost:3001"

function useLoader() {
    const INITIAL_STATE = {
        status: "INITIALIZE",
        data: null,
        error: null
    }

    function reducer(state, { type, payload }) {
        switch (type) {
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

    const [ resident, setResident ] = useLoader()

    function closePanel() {
        setOpenedProfileId(null)
    }

    useEffect(() => {
        if (openedProfileId == null) {
            setResident({type: "INITIALIZE"})
            return
        }
        setResident({type: "LOADING"})
        let controller = new AbortController()
        fetch(URL + "/residents/" + openedProfileId, {
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
        if (resident.status == "INITIALIZE") return <></>
        if (resident.status == "LOADING") {
            return <p className={`${css["loading"]}`}>Загружаем список . . .</p>
        }
        if (resident.status == "ERROR") {
            return <p style={{whiteSpace: "pre-wrap", height: "max-content"}} className={`${css["error"]}`}>Произошла ошибка (да, и такое бывает) ¯\_(ツ)_/¯ 
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

        return (
            <ul>
                <ProfileColumn1 info={resident.data} />
            </ul>
        )
    }

    return (<>
        {openedProfileId == null ?
            <></> :

            <>
                <div className={`${css["profile-disable-bg"]}`}></div>
                <div className={`${css["profile-wrapper"]}`}>
                    <button className={`${css["profile-close"]}`} onClick={closePanel}>
                        <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M30 27.6154L2.25745 2M29.2927 2.38462L0.999999 28" stroke="#AAAAAA" stroke-width="3"/>
                        </svg>
                    </button>
                    {showResident()}
                </div>
            </>
        }
    </>);
}