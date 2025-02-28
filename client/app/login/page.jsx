"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/login/page.module.css"

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useCookies } from 'react-cookie';

import { CLIENT_URL, SERVER_URL } from '@/globals';

import FormSubmitButton from "@/components/shared/form-submit-button"

export default function Login() {

    const router = useRouter()

    const [ errorId, setErrorId ] = useState("200");
    const [ cookies, setCookie, removeCookie ] = useCookies();

    function submit(formData) {
        const login = formData.get("login")
        const password = formData.get("password")

        let currDate = Date.now()

        fetch(SERVER_URL + "/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Key": "Authorization",
                "Value": `Bearer ${JSON.parse(localStorage.getItem("AUTH_TOKEN"))}`
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
                setErrorId(200)
                localStorage.setItem("AUTH_TOKEN", JSON.stringify(res.data.access_token))
                localStorage.setItem("AUTH_TOKEN_EXPIRE", JSON.stringify(new Date(currDate + 24 * 60 * 60 * 1000).getTime()))
                router.push("/", { scroll: false })
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
            {errorId == "401" ?
                <p>Неверное имя пользователя или пароль</p> :
                <p>Повторите попытку позднее</p>
            }
        </div>
    }

    return (<>
        <div className={`${css["wrapper"]}`}>
            <form action={submit}>
                <h2>Вход в систему</h2>
                {errorId != "200" ? showError() : <></>}
                <div>
                    <label htmlFor="login">Имя пользователя</label>
                    <input type="text" name="login" id="login" required={true}/>
                </div>
                <div>
                    <label htmlFor="password">Пароль</label>
                    <input type="password" name="password" id="password" required={true}/>
                </div>
                <FormSubmitButton text="Вход" loadingText="Загрузка..." />
            </form>
        </div>
    </>);
}
