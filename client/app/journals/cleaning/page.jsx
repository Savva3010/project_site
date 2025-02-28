"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/journals/cleaning/page.module.css"

import { useEffect, useState, useReducer, useRef} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import useLoader from '@/lib/loader';
import useDefaultWebsocket from '@/lib/websocket';

import CustomServerError from '@/lib/customServerError';

import { toast } from 'react-toastify';

import Row from '@/components/journals/cleaning/row';

import { SERVER_URL, WS_SERVER_URL } from '@/globals';

import DateModal from '@/components/journals/cleaning/date-modal';


export default function Cleaning() {

    const router = useRouter()

    const [ data, setData ] = useLoader()

    // Connect ot Websocket
    const {sendJsonMessage, lastJsonMessage, readyState} = useDefaultWebsocket()

    // Handle websocket messages
    useEffect(() => {
        let op = lastJsonMessage?.op
        let ws_data = lastJsonMessage?.data
        if (!op || !lastJsonMessage.path) return

        if (lastJsonMessage.path === "/journals/cleaning") {
            if (op === "mark:update") {
                let newData = [...data.data.rooms]
                let room = newData.findIndex(el => el.room_number === ws_data.room)
                let date = newData[room].marks.findIndex(el => el.date === ws_data.date)
                if (ws_data === 0) {
                    if (date === -1) return;
                    newData[room].marks.splice(date, 1)
                } else {
                    if (date != -1) {
                        newData[room].marks[date].mark = ws_data.mark
                    } else {
                        newData[room].marks.push({"date": ws_data.date, "mark": ws_data.mark})
                    }
                }
                setData({type: "SUCCESS", payload: {...data.data, rooms: newData}})
            } else if (op === "date:add") {
                let newData = [...data.data.dates]
                let foundDate = newData.findIndex(date => date === ws_data.date)
                if (foundDate != -1) return
                newData.push(ws_data.date)
                const monthToIdxSorted = {
                    "ЯНВ": 5,
                    "ФЕВ": 6,
                    "МАР": 7,
                    "АПР": 8,
                    "МАЯ": 9,
                    "ИЮН": 10,
                    "ИЮЛ": 11,
                    "АВГ": 12,
                    "СЕН": 1,
                    "ОКТ": 2,
                    "НОЯ": 3,
                    "ДЕК": 4
                }
                newData.sort((a, b) => {
                    let [l_d, l_m] = a.split(" ")
                    let [r_d, r_m] = b.split(" ")
    
                    l_d = parseInt(l_d)
                    l_m = monthToIdxSorted[l_m]
                    r_d = parseInt(r_d)
                    r_m = monthToIdxSorted[r_m]
    
                    if (l_m > r_m) return 1
                    if (l_m < r_m) return -1
                    if (l_d > r_d) return 1
                    if (l_d < r_d) return -1
                    return 0;
                })
                
                let newMarks = [...data.data.rooms]
                newMarks.forEach((room, idx) => {
                    let found = newMarks[idx].marks.findIndex(mark => mark.date === ws_data.date)
                    while (found != -1) {
                        newMarks[idx].marks.splice(found, 1)
                        found = newMarks[idx].marks.findIndex(mark => mark.date === ws_data.date)
                    }
                })
                setData({type: "SUCCESS", payload: {...data.data, dates: newData, rooms: newMarks}})
            } else if (op === "date:delete") {
                let newData = [...data.data.dates]
                let foundDate = newData.findIndex(date => date === ws_data.date)
                if (foundDate === -1) return
                newData.splice(foundDate, 1)
                setData({type: "SUCCESS", payload: {...data.data, dates: newData}})
            }
        }
    }, [lastJsonMessage])

    // Date modal info(create/delete date confirmation)
    const [ dateModal, setDateModal ] = useReducer((state, {type, payload}) => {
        switch (type) {
            case "ADD":
                return {...state, show: true, date: null}
            case "DELETE":
                return {...state, show: true, date: payload}
            case "CLOSE":
                return {...state, show: false, date: null}
            default:
                return {...state}
        }
    }, {
        "show": false,
        "date": null
    })

    // Mark modal info(choose mark)
    const [ markModal, setMarkModal ] = useReducer((state, {type, payload}) => {
        switch (type) {
            case "OPEN":
                return {...state, room: payload.room, date: payload.date}
            case "CLOSE":
                return {...state, room: null, date: null}
        }
    }, {
        "room": null,
        "date": null
    })

    // On add date
    function onAdd() {
        setDateModal({type: "ADD"})
    }

    // On delete date
    function onDelete(date) {
        return () => {
            setDateModal({type: "DELETE", payload: date})
        }
    }

    // Make set_mark API request
    function setMark(mark) {
        let room = markModal.room
        let date = markModal.date
        if (room === null || date === null) return
        setMarkModal({type: "CLOSE"})

        let promise = new Promise((resolve, reject) => {
            fetch(SERVER_URL + "/journals/cleaning/marks", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Key": "Authorization",
                    "Value": `Bearer ${JSON.parse(localStorage.getItem("AUTH_TOKEN"))}`
                },
                mode: "cors",
                body: JSON.stringify({
                    "room": data.data.rooms[markModal.room].room_number,
                    "date": data.data.dates[markModal.date],
                    "mark": mark
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
            pending: "Изменение оценки",
            success: "Оценка изменена",
            error: {
                theme: "colored",
                autoClose: 10000,
                render({data}) {
                    return "Не удалось изменить оценку: " + (data || "")
                }
            }   
        })
    }

    // Fetch marks
    useEffect(() => {
        setData({type: "LOADING"})
        let controller = new AbortController()
        fetch(SERVER_URL + "/journals/cleaning", {
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
            setData({type: "SUCCESS", payload: data.data})
        })
        .catch(err => {
            if (err.name === "AbortError") return
            console.error(err)
            setData({type: "ERROR", payload: err})
        })

        return () => {
            controller.abort()
        }
    }, [])

    // Render table
    function showTable() {
        if (data.status === "INITIALIZE") return <></>
        if (data.status === "LOADING") {
            return <p className={`${css["loading"]}`}>Загружаем журнал . . .</p>
        }
        if (data.status === "ERROR") {
            return <p style={{whiteSpace: "pre-wrap", height: "max-content"}} className={`${css["error"]}`}>Произошла ошибка (да, и такое бывает) ¯\_(ツ)_/¯ 
                <br/>
                Обратитесь к специалисту и попробуйте позже
                <br/>
                <br/>                           
                {data.error.name}
                <br/>
                {data.error.message}
                <br/>
                {data.error.stack}
            </p>
        }

        return <>
            <table className={`${css["table"]}`}>
                <thead>
                    <tr>
                        <th><div><p>№</p></div></th>
                        {data.data.dates.map((date, idx) => {
                            return <th key={idx}><div className={`${css["th-date"]}`}>
                                    <div>
                                        <button onClick={onDelete(date)}>&minus;</button>
                                    </div>
                                    <div>
                                        <p>{date}</p>
                                    </div>
                                </div></th>
                        })}
                        <th><div><p>СР</p></div></th>
                        <th><div className={`${css["button-add"]}`}><button onClick={onAdd}>&#43;</button></div></th>
                        <th><div><p></p></div></th>
                        <th><div><p></p></div></th>
                        <th><div><p></p></div></th>
                        <th><div><p></p></div></th>
                    </tr>
                </thead>
                <tbody>
                {data.data.rooms.map((room, idx) => {
                    return <Row key={idx} rowIdx={idx} dates={data.data.dates} room={room} isGrey={idx % 2 === 0}
                        markModal={markModal} setMarkModal={setMarkModal} setMark={setMark}/>
                })}
                </tbody>
            </table>
        </>
    }

    return (<>
        {!dateModal.show ?
        <></> :
        <DateModal dates={data.data.dates} modalInfo={dateModal} setModalInfo={setDateModal}/>
        }

        {markModal.date === null || markModal.room === null ?
        <></> :
        <div onClick={() => setMarkModal({type: "CLOSE"})} className={`${css["mark-modal-disable-page-bg"]}`}></div>
        }

        <p className={`${css["header"]}`}><b>Журнал оценок за уборку</b></p>
        {showTable()}
    </>);
  }