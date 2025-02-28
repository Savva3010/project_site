"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/profile.module.css"

import { useEffect, useState, useReducer } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Status from './status';

export default function Column2({ info, setSortParams }) {
    const router = useRouter()

    return (<>
        <div className={`${css["col"]} ${css["col2"]}`}>
            <div className={`${css["col2-row"]}`}>
                <div className={`${css["col2-resident"]}`}>
                    <p><b>ФИО: </b>{                  info?.full_name     ? info["full_name"]     : <b>&minus;</b>}</p>
                    <p><b>Возраст: </b>{              info?.age           ? info["age"]           : <b>&minus;</b>}</p>
                    <p><b>Комната: </b>{              info?.room          ? info["room"]          : <b>&minus;</b>}</p>
                    <p><b>Класс: </b>{                info?.class         ? info["class"]         : <b>&minus;</b>}</p>
                    <p><b>Классный руководитель: </b>{info?.class_teacher ? info["class_teacher"] : <b>&minus;</b>}</p>
                    <p><b>Классный воспитатель: </b>{ info?.class_mentor  ? info["class_mentor"]  : <b>&minus;</b>}</p>
                    <p><b>Номер тел.: </b>{           info?.mobile        ? info["mobile"]        : <b>&minus;</b>}</p>
                    <p><b>Почта: </b>{                info?.email         ? info["email"]         : <b>&minus;</b>}</p>
                    <p><b>Telegram: </b>{             info?.telegram      ? info["telegram"]      : <b>&minus;</b>}</p>
                    <p>&nbsp;</p>
                    <button className={`${css["col2-link"]}`} onClick={() => {
                        let newParams = new URLSearchParams(`room=${info?.room}`)
                        router.push(`/rooms/?${newParams.toString()}`, { scroll: false })
                    }}>Комната</button>
                    <button className={`${css["col2-link"]}`} onClick={() => {
                        let newParams = new URLSearchParams()
                        let newFilter = `${info?.room} ${info?.full_name} ${info?.class}`
                        newParams.set("q", newFilter)
                        router.push(`/applications/leave/?${newParams.toString()}`, { scroll: false })
                        closePanel()
                    }}>Заявления</button>
                    <button className={`${css["col2-link"]}`} onClick={() => {
                        let newParams = new URLSearchParams()
                        let newFilter = `${info?.room} ${info?.full_name} ${info?.class}`
                        newParams.set("q", newFilter)
                        router.push(`/journals/leave/?${newParams.toString()}`, { scroll: false })
                        closePanel()
                    }}>Журнал входов/выходов</button>
                </div>

                <div className={`${css["col2-parents"]}`}>
                    <p><b>Родители</b></p>
                    {info?.parents?.length ?
                    <></> :

                    <p className={`${css["col2-no-parents"]}`}>Пусто</p>
                    }
                    {info?.parents?.map((parent, idx) => {
                        return (<div key={idx} className={`${css["col2-parent"]}`}>
                            <p>{parent?.full_name ? parent["full_name"] : <b>&minus;</b>}</p>
                            <p>{parent?.mobile    ? parent["mobile"]    : <b>&minus;</b>}</p>
                            <p>{parent?.email     ? parent["email"]     : <b>&minus;</b>}</p>
                            <p>{parent?.telegram  ? parent["telegram"]  : <b>&minus;</b>}</p>
                        </div>)
                    })}
                </div>
            </div>
            <Status info={info?.status} />
        </div>
    </>);
}