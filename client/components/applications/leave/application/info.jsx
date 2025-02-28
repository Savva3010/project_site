"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/applications/leave/application.module.css"

import { useEffect, useState, useReducer, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import unixToString from '@/lib/unixToString';

import { toast } from 'react-toastify';

import ImgBlurLoad from '@/components/shared/img-blur-load';
import Status from '@/components/residents/profile/status';
import ApplicationStatus from './application-status';

import { SERVER_URL, WS_SERVER_URL } from '@/globals';

export default function Info({ info, closePanel, setSortParams }) {
    const router = useRouter()

    const [ comment, setComment ] = useState("")

    // Set initial comment value
    useEffect(() => {
        setComment(info?.comment || "")
    }, [info, info?.comment])

    // Save comment on unfocus
    function saveComment() {
        
        let promise = new Promise((resolve, reject) => {
            fetch(SERVER_URL + `/applications/leave/${info?.id}/comment`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Key": "Authorization",
                    "Value": `Bearer ${JSON.parse(localStorage.getItem("AUTH_TOKEN"))}`
                },
                mode: "cors",
                body: JSON.stringify({
                    "content": comment
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
                    pending: "Изменение комментария",
                    success: "Комментарий изменён",
                    error: {
                        theme: "colored",
                        autoClose: 10000,
                        render({data}) {
                            return "Не удалось изменить комментарий: " + (data || "")
                        }
                    }   
                })
    }

    function setStatus(status) {
        
        let promise = new Promise((resolve, reject) => {
            fetch(SERVER_URL + `/applications/leave/${info?.id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Key": "Authorization",
                    "Value": `Bearer ${JSON.parse(localStorage.getItem("AUTH_TOKEN"))}`
                },
                mode: "cors",
                body: JSON.stringify({
                    "status": status
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
                    pending: "Изменение статуса",
                    success: "Статус изменён",
                    error: {
                        theme: "colored",
                        autoClose: 10000,
                        render({data}) {
                            return "Не удалось изменить статус: " + (data || "")
                        }
                    }   
                })
    }

    // TODO: add "applications" link from /residdents and /rooms

    return (<>
        <div className={`${css["info"]}`}>
            <div className={`${css["col1"]}`}> 
                <ImgBlurLoad src={info?.resident?.profile_image?.src? SERVER_URL + info.resident.profile_image.src : ""} hash={info?.resident?.profile_image?.blur_hash} className={`${css["col1-blur-img"]}`} alt="Фото проживающего"/>
                <p>&nbsp;</p>
                <p><b>Время выхода: </b>{  info?.leave ? unixToString(new Date(info["leave"]))           : <b>&minus;</b>}</p>
                <p><b>Время входа: </b>{   info?.return ? unixToString(new Date(info["return"]))         : <b>&minus;</b>}</p>
                <p><b>Адрес: </b>{         info?.address ? info["address"]                               : <b>&minus;</b>}</p>
                <p><b>Сопровождающие: </b>{info?.accompany ? info["accompany"]                           : <b>&minus;</b>}</p>
                <p><b>Добавлено: </b>{     info?.created_at ? unixToString(new Date(info["created_at"])) : <b>&minus;</b>}</p>
            </div>
            <div className={`${css["col2"]}`}>
                <div className={`${css["col2-info"]}`}>
                    <div className={`${css["col2-resident"]}`}>
                        <p><b>ФИО: </b>{                  info?.resident?.full_name     ? info["resident"]["full_name"]     : <b>&minus;</b>}</p>
                        <p><b>Возраст: </b>{              info?.resident?.age           ? info["resident"]["age"]           : <b>&minus;</b>}</p>
                        <p><b>Комната: </b>{              info?.resident?.room          ? info["resident"]["room"]          : <b>&minus;</b>}</p>
                        <p><b>Класс: </b>{                info?.resident?.class         ? info["resident"]["class"]         : <b>&minus;</b>}</p>
                        <p><b>Классный руководитель: </b>{info?.resident?.class_teacher ? info["resident"]["class_teacher"] : <b>&minus;</b>}</p>
                        <p><b>Классный воспитатель: </b>{ info?.resident?.class_mentor  ? info["resident"]["class_mentor"]  : <b>&minus;</b>}</p>
                        <p><b>Номер тел.: </b>{           info?.resident?.mobile        ? info["resident"]["mobile"]        : <b>&minus;</b>}</p>
                        <p>&nbsp;</p>
                        <button className={`${css["col2-link"]}`} onClick={() => {
                            let newParams = new URLSearchParams(`profile=${info?.resident?.id}`)
                            router.push(`/residents/?${newParams.toString()}`, { scroll: false })
                        }}>Подробнее</button>
                        <button className={`${css["col2-link"]}`} onClick={() => {
                            let newParams = new URLSearchParams(`room=${info?.resident?.room}`)
                            router.push(`/rooms/?${newParams.toString()}`, { scroll: false })
                        }}>Комната</button>
                        <button className={`${css["col2-link"]}`} onClick={() => {
                            let newParams = new URLSearchParams()
                            let newFilter = `${info?.resident?.room} ${info?.resident?.full_name} ${info?.resident?.class}`
                            newParams.set("q", newFilter)
                            router.push(`/applications/leave?${newParams.toString()}`, { scroll: false })
                            setSortParams({type: "FILTER", payload: newFilter})
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
                        {info?.resident?.parents?.length ?
                        <></> :

                        <p className={`${css["col2-no-parents"]}`}>Пусто</p>
                        }
                        {info?.resident?.parents?.map((parent, idx) => {
                            return (<div key={idx} className={`${css["col2-parent"]}`}>
                                <p>{parent?.full_name ? parent["full_name"] : <b>&minus;</b>}</p>
                                <p>{parent?.mobile    ? parent["mobile"]    : <b>&minus;</b>}</p>
                                <p>{parent?.email     ? parent["email"]     : <b>&minus;</b>}</p>
                                <p>{parent?.telegram  ? parent["telegram"]  : <b>&minus;</b>}</p>
                            </div>)
                        })}
                    </div>
                </div>
                <Status info={info?.resident?.status} />
            </div>
            <div className={`${css["col3"]}`}>
                <ApplicationStatus info={info?.status} />

                <p>&nbsp;</p>

                {["review", "cancelled", "accepted", "active", "expired"].findIndex(status => status === info?. status) === -1 ?
                <></> :
                <button onClick={() => setStatus("denied")}>Отклонить</button>
                }

                {["review", "cancelled", "denied"].findIndex(status => status === info?. status) === -1 ?
                <></> :
                <button onClick={() => setStatus("accepted")}>Одобрить</button>
                }

                {["cancelled"].findIndex(status => status === info?. status) != -1 ?
                <></> :
                <button onClick={() => setStatus("cancelled")}>Аннулировать</button>
                }

                <div className={`${css["col3-comment"]}`}>
                    <div className={`${css["col3-comment-corner"]}`}>
                        <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0L31 15.5L17.9957 30L0 0Z" fill="#FFEEAA"/>
                        </svg>
                    </div>

                    <textarea placeholder={"Комментарий"} value={comment} onBlur={saveComment} onChange={(evt) => setComment(evt.target.value)}></textarea>
                </div>
            </div>
        </div>
    </>);
}