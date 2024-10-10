"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/page.module.css"

import { useEffect, useState } from 'react';

import { location } from '@/enums';

const URL = "https://localhost:3001"

export default function Residents() {

    const [ residents, setResidents ] = useState(null)

    useEffect(() => {
        let controller = new AbortController()
        fetch(URL + "/residents", {
            method: "GET",
            header: {

            },
            signal: controller.signal
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => {
            if (err.name == "AbortError") return
            console.error(err)
            //setResidents(err)
            setResidents(["ASD", "ASD"])
        })

        return () => {
            controller.abort()
        }
    }, [])

    function showResidents() {
        if (residents == null) {
            return <p className={`${css["loading"]}`}>Загружаем список . . .</p>
        }
        if (residents instanceof Error) {
            return <p style={{whiteSpace: "pre-wrap", height: "max-content"}} className={`${css["error"]}`}>Произошла ошибка (да, и такое бывает) ¯\_(ツ)_/¯ 
                <br/>
                Обратитесь к специалисту и попробуйте позже
                <br/>
                <br/>                           
                {residents.name}
                <br/>
                {residents.message}
                <br/>
                {residents.stack}
            </p>
        }
        if (residents.length == 0) {
            return <p className={`${css["empty"]}`}>Проживающих нет, меньше работы ^_^</p>
        }

        return (
            <ul>
                <li className={`${css["columns"]}`}>
                        <div>№</div>
                        <div>ФИО</div>
                        <div>Номер тел.</div>
                        <div>Почта</div>
                        <div>Telegram</div>
                        <div>Статус</div>
                        <div></div>
                </li>
                <li>
                    <div>211/2</div>
                    <div>Серебренников Савва Андреевич</div>
                    <div>+7 123 456 78 90</div>
                    <div>yes@example.com</div>
                    <div>@Savva3010</div>
                    <div className={`${css["status-inside"]}`}>Сейчас в интернате</div>
                    <div><button>Подробнее</button></div>
                </li>
                <li>
                    <div>211/2</div>
                    <div>Серебренников Савва Андреевич</div>
                    <div>+7 123 456 78 90</div>
                    <div>yes@example.com</div>
                    <div>@Savva3010</div>
                    <div className={`${css["status-isolator"]}`}>Сейчас в изоляторе</div>
                    <div><button>Подробнее</button></div>
                </li>
                <li>
                    <div>211/2</div>
                    <div>Серебренников Савва Андреевич</div>
                    <div>+7 123 456 78 90</div>
                    <div>yes@example.com</div>
                    <div>@Savva3010</div>
                    <div className={`${css["status-outside"]}`}>Сейчас не в интернате</div>
                    <div><button>Подробнее</button></div>
                </li>
                <li>
                    <div>211/2</div>
                    <div>Серебренников Савва Андреевич</div>
                    <div>+7 123 456 78 90</div>
                    <div>yes@example.com</div>
                    <div>@Savva3010</div>
                    <div className={`${css["status-school"]}`}>Сейчас в ФТЛ</div>
                    <div><button>Подробнее</button></div>
                </li>
            </ul>
        )
    }

    return (<>
        <div className={`${css["title"]}`}>
            <div className={`${css["summary"]}`}></div>
            <p>Список проживающих</p>
            <div className={`${css["filter"]}`}></div>
        </div>
        <div className={`${css["list"]}`}>
            {showResidents()}
        </div>
    </>);
}