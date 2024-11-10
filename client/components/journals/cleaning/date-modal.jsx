"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/journals/cleaning/date-modal.module.css"

import { useEffect, useState, useReducer } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { location } from '@/enums';

import { SERVER_URL } from '@/globals';

export default function DateModal({ modalInfo, setModalInfo }) {

    function closeModal() {
        setModalInfo({type: "CLOSE"})
    }

    function addNoteWarn() {

    }

    function deleteNoteWarn() {

    }

    return (<>
        <div className={`${css["disable-profile-bg"]}`} onClick={closeModal}></div>
        <div className={`${css["wrapper"]}`}>
            <button className={`${css["close"]}`} onClick={closeModal}>
                <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 27.6154L2.25745 2M29.2927 2.38462L0.999999 28" stroke="#AAAAAA" strokeWidth="3"/>
                </svg>
            </button>

            <p className={`${css["title"]}`}><b>{modalInfo.info == null ? "Добавление" : "Удаление"}</b></p>

            <div className={`${css["modal"]}`}>
                <p className={`${css["hint"]}`}>Вы уверены?</p>
                Месяц, число
                <div className={`${css["buttons"]}`}>
                    {modalInfo.info == null ?
                    <button onClick={deleteNoteWarn} className={`${css["button-add"]}`}>Добавить</button> :

                    <>
                    <button onClick={addNoteWarn} className={`${css["button-delete"]}`}>Да</button>
                    <button onClick={closeModal} className={`${css["button-delete"]}`}>Нет</button>
                    </>
                }
                </div>
            </div>
        </div>
    </>);
}