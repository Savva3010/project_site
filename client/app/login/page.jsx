"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/login/page.module.css"

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';

import { SERVER_URL } from '@/globals';

function Submit() {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending}>
        <b>{pending ? "Загрузка..." : "Вход"}</b>
    </button>
}

export default function Login() {

    const router = useRouter()

    const [ errorId, setErrorId ] = useState(200);

    function submit(formData) {
        const login = formData.get("login")
        const password = formData.get("password")

        fetch(SERVER_URL + "/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify({
                "username": login,
                "password": password
            })
        })
        .then(res => res.json())
        .then((res) => {
            if (!res.success) {
                setErrorId(res.data.error_id)
            } else {
                // TODO: make save token
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    function showError() {
        return <div className={`${css["error"]}`}>
            <p>Что-то пошло не так.</p>
            <p>&nbsp;</p>
            {errorId == 401 ?
                <p>Неверное имя пользоаиеля или пароль</p> :
                <p>Повторите попытку позднее</p>
            }
        </div>
    }

    return (<>
        <div className={`${css["wrapper"]}`}>
            <form action={submit}>
                <h2>Вход в систему</h2>
                {errorId != 200 ? showError() : <></>}
                <div>
                    <label htmlFor="login">Имя пользователя</label>
                    <input type="text" name="login" id="login" required/>
                </div>
                <div>
                    <label htmlFor="password">Пароль</label>
                    <input type="password" name="password" id="password" required/>
                </div>
                <Submit />
            </form>
        </div>
    </>);
}
