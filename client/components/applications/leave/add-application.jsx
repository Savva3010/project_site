"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/applications/leave/add-application.module.css"

import { useEffect, useState, useReducer } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { location } from '@/enums';

import { SERVER_URL } from '@/globals';

export default function AddApplication({ modalInfo, setModalInfo }) {

    const [ addContent, setAddContent ] = useState("")

    // Close modal
    function closeModal() {
        setModalInfo(false)
    }

    // TODO: Make add application logic

    return (<>
        <div className={`${css["disable-page-bg"]}`} onClick={closeModal}></div>
        <div className={`${css["wrapper"]}`}>
            <button className={`${css["close"]}`} onClick={closeModal}>
                <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 27.6154L2.25745 2M29.2927 2.38462L0.999999 28" stroke="#AAAAAA" strokeWidth="3"/>
                </svg>
            </button>

            <p className={`${css["title"]}`}><b>Добавить заявление</b></p>

            <div className={`${css["modal"]}`}>
                <div className={`${css["category"]}`}>
                    <p><b>Проживающий</b></p>
                    <div className={`${css["selector"]}`}>
                        <label htmlFor="add-app-modal-select-room">Комната</label>
                        <select name="" id="add-app-modal-select-room">
                        </select>
                    </div>
                    <div className={`${css["selector"]}`}>
                        <label htmlFor="add-app-modal-select-resident">Проживающий</label>
                        <select name="" id="add-app-modal-select-resident">
                        </select>
                    </div>
                </div>
                <div className={`${css["category"]}`}>
                    <p><b>Дополнительно</b></p>
                    <div className={`${css["selector"]}`}>
                        <label htmlFor="add-app-modal-select-leave">Время выхода</label>
                        <select name="" id="add-app-modal-select-leave">
                        </select>
                    </div>
                    <div className={`${css["selector"]}`}>
                        <label htmlFor="add-app-modal-select-address">Адрес</label>
                        <select name="" id="add-app-modal-select-address">
                        </select>
                    </div>
                    <div className={`${css["selector"]}`}>
                        <label htmlFor="add-app-modal-select-return">Время входа</label>
                        <select name="" id="add-app-modal-select-return">
                        </select>
                    </div>
                    <div className={`${css["selector"]}`}>
                        <label htmlFor="add-app-modal-select-accompany">Сопровождающие</label>
                        <select name="" id="add-app-modal-select-accompany">
                        </select>
                    </div>
                </div>
                <div className={`${css["buttons"]}`}>
                    <button onClick={() => {}} className={`${css["button-add"]}`}>Добавить</button>
                </div>
            </div>
        </div>
    </>);
}