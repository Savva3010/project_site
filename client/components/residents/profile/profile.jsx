"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/profile.module.css"

import { useEffect, useState, useReducer } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import useLoader from '@/lib/loader';
import useDefaultWebsocket from '@/lib/websocket';

import CustomServerError from '@/lib/customServerError';

import { location } from '@/enums';

import Column1 from './column1';
import Column2 from './column2';
import Column3 from './column3';

import NoteWarnModal from './note-warn-modal';

import { SERVER_URL, WS_SERVER_URL } from '@/globals';

export default function Profile({ openedProfileId, setOpenedProfileId }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [ resident, setResident ] = useLoader()

    // Connect to websocket
    const {sendJsonMessage, lastJsonMessage, readyState} = useDefaultWebsocket()

    // Handle websocket messages
    useEffect(() => {
        if (openedProfileId === null) return
        let op = lastJsonMessage?.op
        let ws_data = lastJsonMessage?.data
        if (!op || !lastJsonMessage.path) return

        if (lastJsonMessage.path === "/residents") {
            if (op === "status:update") {
                if (resident.data.id != ws_data.id) return
                let newResident = {...resident.data}
                newResident.status = ws_data.status
                setResident({type: "SUCCESS", payload: newResident})
            }
        }
    }, [lastJsonMessage])

    // Note/warn modal info
    const [ noteWarnModal, setNoteWarnModal ] = useReducer((state, {type, payload}) => {
        switch (type) {
            case "ADD_NOTE":
                return {...state, category: "NOTE", info: null}
            case "ADD_WARN":
                return {...state, category: "WARN", info: null}
            case "DELETE_NOTE":
                return {...state, category: "NOTE", info: payload}
            case "DELETE_WARN":
                return {...state, category: "WARN", info: payload}
            case "CLOSE":
                return {...state, category: null, info: null}
            default:
                return {...state}
        }
    }, {
        "category": null,
        "info": null
    })

    // Close modal
    function closePanel() {
        setOpenedProfileId(null)
        setResident({type: "INITIALIZE"})
        setNoteWarnModal({type: "CLOSE"})
        let newParams = new URLSearchParams(searchParams.toString())
        newParams.delete("profile")
        router.replace(`/residents/?${newParams.toString()}`, { scroll: false })
    }

    // Fetch resident profile
    useEffect(() => {
        if (openedProfileId === null) return
        setResident({type: "LOADING"})
        let controller = new AbortController()
        fetch(SERVER_URL + "/residents/" + openedProfileId, {
            method: "GET",
            headers: {
                "Key": "Authorization",
                "Value": `Bearer ${JSON.parse(localStorage.getItem("AUTH_TOKEN"))}`
            },
            signal: controller.signal
        })
        .then(res => {
            return res.json()
            .then(body => {
                if (res.status != 200 || !body || !body?.success) {
                    throw new CustomServerError(body.data.message)
                }
                return body
            })
        })
        .then(data => {
            setResident({type: "SUCCESS", payload: data.data})
        })
        .catch(err => {
            if (err.name === "AbortError") return
            console.error(err)
            setResident({type: "ERROR", payload: err})
        })

        return () => {
            controller.abort()
        }
    }, [openedProfileId])

    // Show modal content
    function showResident() {
        if (resident.status === "ERROR") {
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
                <Column3 info={resident.data} setNoteWarnModal={setNoteWarnModal}/>
        </>)
    }
    return (<>
        {openedProfileId === null ?
            <></> :

            <>
                <div className={`${css["disable-page-bg"]}`} onClick={closePanel}></div>
                <div className={`${css["wrapper"]}`}>
                    <button className={`${css["settings"]}`}>
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M29.4331 18.006L27.1476 16.201C26.7834 15.9134 26.5813 15.4728 26.5811 15.0087C26.5811 15.0038 26.5811 14.9989 26.5811 14.994C26.5803 14.529 26.7827 14.0871 27.1475 13.7989L29.4331 11.9939C29.9565 11.5805 30.1417 10.8697 29.8864 10.2536L28.8825 7.82978C28.6273 7.21361 27.9938 6.84189 27.3314 6.91971L24.4389 7.25955C23.9771 7.31381 23.5215 7.14435 23.1933 6.81506C23.1898 6.81154 23.1863 6.80809 23.1829 6.80463C22.8549 6.47639 22.6863 6.02182 22.7404 5.56098L23.0802 2.66861C23.158 2.00621 22.7863 1.37276 22.1702 1.11752L19.7463 0.113576C19.1301 -0.141659 18.4194 0.0434976 18.006 0.566857L16.201 2.85231C15.9135 3.21647 15.4727 3.41861 15.0087 3.41879C15.0038 3.41879 14.9989 3.41879 14.9939 3.41879C14.529 3.41961 14.0871 3.21723 13.7989 2.85236L11.9939 0.566857C11.5806 0.043439 10.8698 -0.141659 10.2536 0.113576L7.82985 1.11746C7.21368 1.3727 6.84196 2.00615 6.91977 2.66861L7.25956 5.56115C7.31382 6.02293 7.14448 6.4785 6.81512 6.80668C6.81167 6.81014 6.80821 6.81359 6.8047 6.81711C6.47645 7.14512 6.02188 7.31381 5.56098 7.25961L2.66862 6.91982C2.00621 6.84201 1.37276 7.21367 1.11752 7.82984L0.113576 10.2536C-0.141659 10.8698 0.0434976 11.5805 0.566857 11.9939L2.85237 13.7989C3.21653 14.0865 3.41868 14.5272 3.41885 14.9912C3.41885 14.9961 3.41885 15.001 3.41885 15.0059C3.41967 15.4708 3.21729 15.9127 2.85243 16.2009L0.566857 18.006C0.043439 18.4194 -0.141659 19.1301 0.113576 19.7463L1.11752 22.17C1.37276 22.7862 2.00627 23.1579 2.66862 23.0801L5.56116 22.7403C6.023 22.6861 6.4785 22.8554 6.80675 23.1848C6.8102 23.1883 6.81366 23.1918 6.81718 23.1952C7.14513 23.5235 7.31382 23.978 7.25968 24.4389L6.91989 27.3314C6.84208 27.9938 7.21374 28.6272 7.82997 28.8825L10.2538 29.8864C10.8699 30.1416 11.5807 29.9565 11.9941 29.4331L13.799 27.1477C14.0866 26.7835 14.5273 26.5814 14.9912 26.5811C14.9962 26.5811 15.0011 26.5811 15.006 26.5811C15.471 26.5803 15.9129 26.7827 16.201 27.1476L18.0061 29.4331C18.4195 29.9565 19.1302 30.1417 19.7464 29.8864L22.1702 28.8825C22.7863 28.6272 23.1581 27.9937 23.0802 27.3314L22.7404 24.4388C22.6861 23.977 22.8555 23.5215 23.1849 23.1933C23.1883 23.1898 23.1919 23.1863 23.1953 23.1829C23.5236 22.8549 23.9781 22.6862 24.439 22.7404L27.3314 23.0802C27.9938 23.158 28.6273 22.7863 28.8825 22.1701L29.8864 19.7464C30.1417 19.1301 29.9565 18.4194 29.4331 18.006ZM16.4819 19.3182C14.1569 20.2812 11.4914 19.1772 10.5284 16.8522C9.56534 14.5272 10.6694 11.8617 12.9944 10.8986C15.3194 9.93553 17.985 11.0396 18.948 13.3647C19.911 15.6897 18.8069 18.3552 16.4819 19.3182Z" fill="#AAAAAA"/>
                        </svg>
                    </button>

                    <button className={`${css["close"]}`} onClick={closePanel}>
                        <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M30 27.6154L2.25745 2M29.2927 2.38462L0.999999 28" stroke="#AAAAAA" strokeWidth="3"/>
                        </svg>
                    </button>

                    {resident.status != "LOADING" ?
                    <></> :

                    <>
                        <div className={`${css["disable-profile-bg"]}`}></div>
                        <p className={`${css["loading-text"]}`}><b>Загрузка...</b></p>
                    </>
                    }

                    {noteWarnModal.category === null ?
                    <></> :

                    <NoteWarnModal modalInfo={noteWarnModal} setModalInfo={setNoteWarnModal}/>
                    }

                    <div className={`${css["profile"]}`}>
                        {showResident()}
                    </div>
                </div>
            </>
        }
    </>);
}