"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/applications/leave/file-action-modal.module.css"

import { useEffect, useState, useReducer } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { location } from '@/enums';

import { SERVER_URL } from '@/globals';

export default function FileActionModal({ modalInfo, setModalInfo }) {

    const [ addContent, setAddContent ] = useState("")


    // Close modal
    function closeModal() {
        setModalInfo({type: "CLOSE"})
    }

    // TODO: make delete and addfile
    function addFile() {

    }

    function deleteFile() {

    }

    // Show hint above the note/warn
    function showHint() {
        if (modalInfo.category === "ADD") {
            return "Выберите файл"
        } else {
            return "Вы уверены, что хотите удалить файл?"
        }
    }

    // Show note/warn
    function showContent() {
        if (modalInfo.category === "ADD") {
            return <input type='file'/>
        } else {
            return <a
                href={`${SERVER_URL}${modalInfo.info?.src}`}
                target="_blank"
                rel="noreferrer"
            >{modalInfo.info?.filename || "Без имени"}</a>
        }
    }

    return (<>
        <div className={`${css["disable-profile-trigger"]}`} onClick={closeModal}></div>
        <div className={`${css["disable-profile-bg"]}`}></div>
        <div className={`${css["wrapper"]}`}>
            <button className={`${css["close"]}`} onClick={closeModal}>
                <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 27.6154L2.25745 2M29.2927 2.38462L0.999999 28" stroke="#AAAAAA" strokeWidth="3"/>
                </svg>
            </button>

            <p className={`${css["title"]}`}><b>{modalInfo.category === "ADD" ? "Добавление" : "Удаление"}</b></p>

            <div className={`${css["modal"]}`}>
                <p className={`${css["hint"]}`}>{showHint()}</p>
                {showContent()}
                <div className={`${css["buttons"]}`}>
                    {modalInfo.category === "ADD" ?
                    <button onClick={addFile} className={`${css["button-add"]}`}>Добавить</button> :

                    <>
                    <button onClick={deleteFile} className={`${css["button-delete"]}`}>Да</button>
                    <button onClick={closeModal} className={`${css["button-delete"]}`}>Нет</button>
                    </>
                }
                </div>
            </div>
        </div>
    </>);
}