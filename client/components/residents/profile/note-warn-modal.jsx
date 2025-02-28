"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/note-warn-modal.module.css"

import { useEffect, useState, useReducer } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { location } from '@/enums';

import { SERVER_URL } from '@/globals';

import { toast } from 'react-toastify';

import Note from './note';
import Warn from './warn';

export default function NoteWarnModal({ info, modalInfo, setModalInfo }) {

    const [ addContent, setAddContent ] = useState("")

    // Close modal
    function closeModal() {
        setModalInfo({type: "CLOSE"})
    }

    // Add note/warn
    function addNoteWarn(formData) {
        let content = formData.get("input")

        setModalInfo({type: "CLOSE"})
        let promise = new Promise((resolve, reject) => {
            fetch(SERVER_URL + `/residents/${info.id}/${modalInfo.category === "NOTE" ? "notes" : "warns"}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Key": "Authorization",
                    "Value": `Bearer ${JSON.parse(localStorage.getItem("AUTH_TOKEN"))}`
                },
                mode: "cors",
                body: JSON.stringify({
                    "content": content
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
            pending: `Добавление ${modalInfo.category === "NOTE" ? "заметки" : "замечания"}`,
            success: (modalInfo.category === "NOTE" ? "Заметка доваблена" : "Замечание добавлено"),
            error: {
                theme: "colored",
                autoClose: 10000,
                render({data}) {
                    return `Не удалось добавить ${modalInfo.category === "NOTE" ? "заметку" : "замечание"}: ` + (data || "")
                }
            }   
        })
    }

    // Delete note/warn
    function deleteNoteWarn(formData) {
        setModalInfo({type: "CLOSE"})
        let promise = new Promise((resolve, reject) => {
            fetch(SERVER_URL + `/residents/${info.id}/${modalInfo.category === "NOTE" ? "notes" : "warns"}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Key": "Authorization",
                    "Value": `Bearer ${JSON.parse(localStorage.getItem("AUTH_TOKEN"))}`
                },
                mode: "cors",
                body: JSON.stringify({
                    "id": modalInfo.info.id
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
            pending: `Удаление ${modalInfo.category === "NOTE" ? "заметки" : "замечания"}`,
            success: (modalInfo.category === "NOTE" ? "Заметка удалена" : "Замечание удалено"),
            error: {
                theme: "colored",
                autoClose: 10000,
                render({data}) {
                    return `Не удалось удалить ${modalInfo.category === "NOTE" ? "заметку" : "замечание"}: ` + (data || "")
                }
            }   
        })
    }

    // Show hint above the note/warn
    function showHint() {
        if (modalInfo.info === null) {
            if (modalInfo.category === "NOTE") {
                return "Введите текст заметки"
            } else {
                return "Введите текст замечания"
            }
        } else {
            if (modalInfo.category === "NOTE") {
                return "Вы уверены, что хотите удалить заметку?"
            } else {
                return "Вы уверены, что хотите удалить замечание?"
            }
        }
    }

    // Show note/warn
    function showContent() {
        if (modalInfo.category === "NOTE") {
            if (modalInfo.info === null) {
                return <Note content={addContent} setContent={setAddContent} placeholder={"Заметка"}/>
            } else {
                return <Note note={modalInfo.info}/>
            }
        } else {
            if (modalInfo.info === null) {
                return <Warn warn={{"author": "Серебренников Савва Андреевич", "date": "19.09.2024"}} content={addContent} setContent={setAddContent} placeholder={"Замечание"}/>
            } else {
                return <Warn warn={modalInfo.info}/>
            }
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

            <p className={`${css["title"]}`}><b>{modalInfo.info === null ? "Добавление" : "Удаление"}</b></p>

            <form action={modalInfo.info === null ? addNoteWarn : deleteNoteWarn} className={`${css["modal"]}`}>
                <p className={`${css["hint"]}`}>{showHint()}</p>
                {showContent()}
                <div className={`${css["buttons"]}`}>
                    {modalInfo.info === null ?
                    <button type="submit" className={`${css["button-add"]}`}>Добавить</button> :

                    <>
                    <button type="submit" className={`${css["button-delete"]}`}>Да</button>
                    <button type="button"  onClick={closeModal} className={`${css["button-delete"]}`}>Нет</button>
                    </>
                }
                </div>
            </form>
        </div>
    </>);
}