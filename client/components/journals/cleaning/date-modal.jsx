"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/journals/cleaning/date-modal.module.css"

import { useEffect, useState, useReducer, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { toast } from 'react-toastify';

import { location } from '@/enums';

import { SERVER_URL } from '@/globals';

export default function DateModal({ dates, modalInfo, setModalInfo }) {

    // Start sort from September instead of January
    const monthShift = 8

    const months = [
        {
            "value": "СЕН",
            "text": "Сентябрь"
        },
        {
            "value": "ОКТ",
            "text": "Октябрь"
        },
        {
            "value": "НОЯ",
            "text": "Ноябрь"
        },
        {
            "value": "ДЕК",
            "text": "Декабрь"
        },
        {
            "value": "ЯНВ",
            "text": "Январь"
        },
        {
            "value": "ФЕВ",
            "text": "Февраль"
        },
        {
            "value": "МАР",
            "text": "Март"
        },
        {
            "value": "АПР",
            "text": "Апрель"
        },
        {
            "value": "МАЯ",
            "text": "Май"
        },
        {
            "value": "ИЮН",
            "text": "Июнь"
        },
        {
            "value": "ИЮЛ",
            "text": "Июль"
        },
        {
            "value": "АВГ",
            "text": "Август"
        },
    ]

    const days = {
        "СЕН": 30,
        "ОКТ": 31,
        "НОЯ": 30,
        "ДЕК": 31,
        "ЯНВ": 31,
        "ФЕВ": 29,
        "МАР": 31,
        "АПР": 30,
        "МАЯ": 31,
        "ИЮН": 30,
        "ИЮЛ": 31,
        "АВГ": 31
    }

    const [ selectedMonth, setSelectedMonth ] = useState("СЕН")

    // You can select only days that are not added yet
    const daysToSelect = useMemo(() => {
        let arr = []
        for (let i = 1; i <= days[selectedMonth]; ++i) {
            if (!dates.find(date => date === `${i} ${selectedMonth}`)) {
                arr.push({"value": i, "text": i})
            }
        }
        setSelectedDay((arr.length != 0 ? arr[0].value : "NO"))

        return arr
    }, [selectedMonth])

    // Close modal
    function closeModal() {
        setModalInfo({type: "CLOSE"})
    }

    // Make add_date API request
    function addDate(formData) {
        let selectedMonth = formData.get("month")
        let selectedDay = formData.get("day")

        if (selectedDay === "NO" || !selectedDay || !selectedMonth) return
        setModalInfo({type: "CLOSE"})

        let promise = new Promise((resolve, reject) => {
            fetch(SERVER_URL + "/journals/cleaning/dates", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Key": "Authorization",
                    "Value": `Bearer ${JSON.parse(localStorage.getItem("AUTH_TOKEN"))}`
                },
                mode: "cors",
                body: JSON.stringify({
                    "month": (months.findIndex(month => month.value === selectedMonth) + monthShift) % 12 + 1,
                    "day": selectedDay
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
            pending: "Добавление даты",
            success: "Дата добавлена",
            error: {
                theme: "colored",
                autoClose: 10000,
                render({data}) {
                    return "Не удалось добавить дату: " + (data || "")
                }
            }   
        })
    }

    // Make delete_date API request
    function deleteDate(formData) {
        setModalInfo({type: "CLOSE"})
        let promise = new Promise((resolve, reject) => {
            fetch(SERVER_URL + "/journals/cleaning/dates", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Key": "Authorization",
                    "Value": `Bearer ${JSON.parse(localStorage.getItem("AUTH_TOKEN"))}`
                },
                mode: "cors",
                body: JSON.stringify({
                    "date": modalInfo.date
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
            pending: "Удаление даты",
            success: "Дата удалена",
            error: {
                theme: "colored",
                autoClose: 10000,
                render({data}) {
                    return "Не удалось удалить дату: " + (data || "")
                }
            }   
        })
    }

    // Show month and day selectors
    function showSelector() {
        return <div className={`${css["selectors"]}`}>
            <div className={`${css["selector"]}`}>
                <label htmlFor="month">Месяц</label>
                <select value={selectedMonth} onChange={(evt) => setSelectedMonth(evt.target.value)} name="month" id="month" required={true}>
                    {months.map((month, idx) => {
                        return <option key={idx} value={month.value}>{month.text}</option>
                    })}
                </select>
            </div>
            <div className={`${css["selector"]}`}>
                <label htmlFor="day">Число</label>
                <select name="day" id="day" required={true}>
                    {daysToSelect.map((day, idx) => {
                        return <option key={idx} value={day.value}>{day.text}</option>
                    })}
                </select>
            </div>
        </div>
    }

    return (<>
        <div className={`${css["disable-page-bg"]}`} onClick={closeModal}></div>
        <div className={`${css["wrapper"]}`}>
            <button className={`${css["close"]}`} onClick={closeModal}>
                <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 27.6154L2.25745 2M29.2927 2.38462L0.999999 28" stroke="#AAAAAA" strokeWidth="3"/>
                </svg>
            </button>

            <p className={`${css["title"]}`}><b>{modalInfo.date === null ? "Добавление" : "Удаление"}</b></p>

            <form action={modalInfo.date === null ? addDate : deleteDate} className={`${css["modal"]}`}>
                <p className={`${css["hint"]}`}>{modalInfo.date === null ? "Выберите дату для добавления": `Вы уверены, что хотите удалить дату ${modalInfo.date}?`}</p>
                {modalInfo.date != null ?
                <></> :
                showSelector()
                }
                <div className={`${css["buttons"]}`}>
                    {modalInfo.date === null ?
                    <button type="submit" className={`${css["button-add"]}`}>Добавить</button> :

                    <>
                    <button type="submit" className={`${css["button-delete"]}`}>Да</button>
                    <button type="button" onClick={closeModal} className={`${css["button-delete"]}`}>Нет</button>
                    </>
                }
                </div>
            </form>
        </div>
    </>);
}