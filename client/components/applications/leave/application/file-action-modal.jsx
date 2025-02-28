"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/applications/leave/file-action-modal.module.css"

import { useEffect, useState, useReducer } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { location } from '@/enums';

import { toast } from 'react-toastify';

import { SERVER_URL } from '@/globals';

export default function FileActionModal({ applicationId, modalInfo, setModalInfo }) {
    const router = useRouter()
    
    // Close modal
    function closeModal() {
        setModalInfo({type: "CLOSE"})
    }

    function addFile(formData) {
        let file = formData.get("file")

        if (!file) return
        let promise = new Promise((resolve, reject) => {      
            let data = new FormData()
            data.set("main", file)

            let name = new URLSearchParams
            name.set("name", file.name)
            fetch(SERVER_URL + `/applications/leave/${applicationId}/file?${name.toString()}`, {
                method: "POST",
                headers: {
                    "Key": "Authorization",
                    "Value": `Bearer ${JSON.parse(localStorage.getItem("AUTH_TOKEN"))}`
                },
                mode: "cors",
                body: data
            })
            .then(res => res.json())
            .then((res) => {
                if (!res.success) {
                    reject(res.data.message)
                } else {
                    resolve()
                    closeModal()
                }
            })
            .catch(err => {
                reject()
                console.log(err)
            })
        })
        
        toast.promise(promise, {
            pending: "Добавление файла",
            success: "файл добавлен",
            error: {
                theme: "colored",
                autoClose: 10000,
                render({data}) {
                    return "Не удалось добавить файл: " + (data || "")
                }
            }   
        })
    }

    function deleteFile(formData) {
        let promise = new Promise((resolve, reject) => {
            let path = new URLSearchParams
            path.set("path", modalInfo.info?.src)
            fetch(SERVER_URL + `/applications/leave/${applicationId}/file?${path.toString()}`, {
                method: "DELETE",
                headers: {
                    "Key": "Authorization",
                    "Value": `Bearer ${JSON.parse(localStorage.getItem("AUTH_TOKEN"))}`
                },
                mode: "cors"
            })
            .then(res => res.json())
            .then((res) => {
                if (!res.success) {
                    reject(res.data.message)
                } else {
                    resolve()
                    closeModal()
                }
            })
            .catch(err => {
                reject()
                console.log(err)
            })
        })
        
        toast.promise(promise, {
            pending: "Удаление файла",
            success: "файл удалён",
            error: {
                theme: "colored",
                autoClose: 10000,
                render({data}) {
                    return "Не удалось удалить файл: " + (data || "")
                }
            }   
        })
    }

    // Show hint above the add/delete
    function showHint() {
        if (modalInfo.category === "ADD") {
            return "Выберите файл"
        } else {
            return "Вы уверены, что хотите удалить файл?"
        }
    }

    // Show add/delete
    function showContent() {
        if (modalInfo.category === "ADD") {
            return <input type='file' name="file" accept='.png,.jpg,.jpeg,.svg' required={true}/>
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

            <form action={modalInfo.category === "ADD" ? addFile : deleteFile} className={`${css["modal"]}`}>
                <p className={`${css["hint"]}`}>{showHint()}</p>
                {showContent()}
                <div className={`${css["buttons"]}`}>
                    {modalInfo.category === "ADD" ?
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