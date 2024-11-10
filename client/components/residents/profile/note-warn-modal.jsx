"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/note-warn-modal.module.css"

import { useEffect, useState, useReducer } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { location } from '@/enums';

import { SERVER_URL } from '@/globals';

import Note from './note';
import Warn from './warn';

export default function NoteWarnModal({ modalInfo, setModalInfo }) {

    const [ addContent, setAddContent ] = useState("")

    function closeModal() {
        setModalInfo({type: "CLOSE"})
    }

    function addNoteWarn() {

    }

    function deleteNoteWarn() {

    }

    function showHint() {
        if (modalInfo.info == null) {
            if (modalInfo.category == "NOTE") {
                return "Введите текст заметки"
            } else {
                return "Введите текст замечания"
            }
        } else {
            if (modalInfo.category == "NOTE") {
                return "Вы уверены, что хотите удалить заметку?"
            } else {
                return "Вы уверены, что хотите удалить замечание?"
            }
        }
    }

    function showContent() {
        if (modalInfo.category == "NOTE") {
            if (modalInfo.info == null) {
                return <Note content={addContent} setContent={setAddContent} placeholder={"Заметка"}/>
            } else {
                return <Note note={modalInfo.info}/>
            }
        } else {
            if (modalInfo.info == null) {
                return <Warn warn={{"author": "Серебренников Савва Андреевич", "date": "19.09.2024"}} content={addContent} setContent={setAddContent} placeholder={"Замечание"}/>
            } else {
                return <Warn warn={modalInfo.info}/>
            }
        }
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
                <p className={`${css["hint"]}`}>{showHint()}</p>
                {showContent()}
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