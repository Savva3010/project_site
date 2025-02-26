"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/applications/leave/add-application.module.css"

import { useEffect, useState, useReducer, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import useLoader from '@/lib/loader';

import { toast } from 'react-toastify';

import { location } from '@/enums';

import { SERVER_URL } from '@/globals';

export default function AddApplication({ modalInfo, setModalInfo }) {

    const [ residents, setResidents ] = useLoader()

    const [ selectedRoom, setSelectedRoom ] = useState()

    const avail_rooms =  useMemo(() => {
            if (residents.status != "SUCCESS") return []

            let arr = []
            
            residents.data.forEach(resident => {
                if (!arr.includes(resident.room)) {
                    arr.push(resident.room)
                }
            })
            setSelectedRoom(arr[0])

            return arr
        }, [residents])
    
    const avail_residents =  useMemo(() => {
        if (residents.status != "SUCCESS") return []

        let arr = []
        
        residents.data.forEach(resident => {
            if (resident.room == selectedRoom) {
                arr.push(resident)
            }
        })
        return arr
    }, [selectedRoom])

    // Fetch residents
    useEffect(() => {
        setResidents({type: "LOADING"})
        let controller = new AbortController()
        fetch(SERVER_URL + "/residents", {
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
            setResidents({type: "SUCCESS", payload: data.data})
        })
        .catch(err => {
            if (err.name === "AbortError") return
            console.error(err)
            setResidents({type: "ERROR", payload: err})
        })

        return () => {
            controller.abort()
        }
    }, [])


    // Close modal
    function closeModal() {
        setModalInfo(false)
    }

    // Add application
    function submit(formData) {
        let room = formData.get("room")
        let resident = Number(formData.get("resident"))
        let leave_time = formData.get("leave")
        let address = formData.get("address")
        let return_time = formData.get("return")
        let accompany = formData.get("accompany")

        closeModal()
        let promise = new Promise((resolve, reject) => {
            fetch(SERVER_URL + "/applications/leave", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Key": "Authorization",
                    "Value": `Bearer ${JSON.parse(localStorage.getItem("AUTH_TOKEN"))}`
                },
                mode: "cors",
                body: JSON.stringify({
                    "resident_id": resident,
                    "leave_time": leave_time,
                    "address": address,
                    "return_time": return_time,
                    "accompany": accompany
                })
            })
            .then(res => res.json())
            .then((res) => {
                if (!res.success) {
                    reject(res.data.message)
                } else {
                    resolve()
                }
            })
            .catch(err => {
                reject()
                console.log(err)
            })
        })

        toast.promise(promise, {
            pending: "Добавление заявление",
            success: "Заявление добавлено",
            error: {
                theme: "colored",
                autoClose: 10000,
                render({data}) {
                    return "Не удалось добавить заявление: " + (data || "")
                }
            }   
        })
    }

    // Show form
    function showForm() {
        if (residents.status != "SUCCESS") {
            return <h2>Загрузка...</h2>
        }

        return <form action={submit} className={`${css["modal"]}`}>
                    <div className={`${css["category"]}`}>
                        <p><b>Проживающий</b></p>
                        <div className={`${css["selector"]}`}>
                            <label htmlFor="room">Комната</label>
                            <select onChange={(evt) => setSelectedRoom(evt.target.value)} name="room" id="room" required={true}>
                                {avail_rooms.map((room, idx) => {
                                    return <option key={idx} value={room}>{room}</option>
                                })}
                            </select>
                        </div>
                        <div className={`${css["selector"]}`}>
                            <label htmlFor="resident">Проживающий</label>
                            <select name="resident" id="resident" required={true}>
                                {avail_residents.map((resident, idx) => {
                                    return <option key={idx} value={resident.id}>{`${resident.full_name} ${resident.class}`}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <div className={`${css["category"]}`}>
                        <p><b>Дополнительно</b></p>
                        <div className={`${css["selector"]}`}>
                            <label htmlFor="leave">Время выхода</label>
                            <input type="datetime-local" name="leave" id="leave" required={true}/>
                        </div>
                        <div className={`${css["selector"]}`}>
                            <label htmlFor="address">Адрес</label>
                            <input type="text" name="address" id="address" required={true}/>
                        </div>
                        <div className={`${css["selector"]}`}>
                            <label htmlFor="return">Время входа</label>
                            <input type="datetime-local" name="return" id="return" required={true}/>
                        </div>
                        <div className={`${css["selector"]}`}>
                            <label htmlFor="accompany">Сопровождающие</label>
                            <input type="text" name="accompany" id="accompany" required={true}/>
                        </div>
                    </div>
                    <div className={`${css["buttons"]}`}>
                        <button className={`${css["button-add"]}`}>Добавить</button>
                    </div>
                </form>
    }

    return (<>
        <div className={`${css["disable-page-bg"]}`} onClick={closeModal}></div>
        <div className={`${css["wrapper"]}`}>
            <button className={`${css["close"]}`} onClick={closeModal}>
                <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 27.6154L2.25745 2M29.2927 2.38462L0.999999 28" stroke="#AAAAAA" strokeWidth="3"/>
                </svg>
            </button>

            <p className={`${css["title"]}`}><b>Добавить заявление</b></p>

            {showForm()}
        </div>
    </>);
}