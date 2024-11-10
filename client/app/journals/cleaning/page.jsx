"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/journals/cleaning/page.module.css"

import { useEffect, useReducer } from 'react';

import Row from '@/components/journals/cleaning/row';

import { SERVER_URL } from '@/globals';

import DateModal from '@/components/journals/cleaning/date-modal';

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

export default function Cleaning() {

    const [ data, setData ] = useLoader()

    const [ dateModal, setDateModal ] = useReducer((state, {type, payload}) => {
        switch(type) {
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

    function onAdd() {
        setDateModal({type: "ADD"})
    }

    function onDelete(date) {
        return () => {
            setDateModal({type: "DELETE", payload: date})
        }
    }

    useEffect(() => {
        setData({type: "LOADING"})
        let controller = new AbortController()
        fetch(SERVER_URL + "/journals/cleaning", {
            method: "GET",
            header: {

            },
            signal: controller.signal
        })
        .then(res => res.json())
        .then(data => {
            setData({type: "SUCCESS", payload: data.data})
        })
        .catch(err => {
            if (err.name == "AbortError") return
            console.error(err)
            setData({type: "ERROR", payload: err})
        })

        return () => {
            controller.abort()
        }
    }, [])

    function showTable() {
        if (data.status == "INITIALIZE") return <></>
        if (data.status == "LOADING") {
            return <p className={`${css["loading"]}`}>Загружаем журнал . . .</p>
        }
        if (data.status == "ERROR") {
            return <p style={{whiteSpace: "pre-wrap", height: "max-content"}} className={`${css["error"]}`}>Произошла ошибка (да, и такое бывает) ¯\_(ツ)_/¯ 
                <br/>
                Обратитесь к специалисту и попробуйте позже
                <br/>
                <br/>                           
                {residents.error.name}
                <br/>
                {residents.error.message}
                <br/>
                {residents.error.stack}
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
                    return <Row key={idx} dates={data.data.dates} room={room} isGrey={idx % 2 == 0} />
                })}
                </tbody>
            </table>
        </>
    }

    return (<>
        {!dateModal.show ?
        <></> :
        <DateModal modalInfo={dateModal} setModalInfo={setDateModal}/>
        }

        <p className={`${css["header"]}`}><b>Журнал оценок за уборку</b></p>
        {showTable()}
    </>);
  }