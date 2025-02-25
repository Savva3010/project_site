"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/header.module.css"

import { useState, useContext } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import { CurrentUser } from '@/layout';

export default function Header({ sidebarCollapsed, setSidebarCollapsed }) {

    const currentUser = useContext(CurrentUser)

    const router = useRouter()
    const pathname = usePathname()

    const [ isToggled, setIsToggled ] = useState(false)

    function showName() {
        if (pathname === "/login") {
            return <p>Войти</p>
        }
        if (currentUser) {
            return <p>{`${currentUser.surname} ${currentUser.name}`}</p>
        }
        return <p>Загрузка...</p>
    }

    function logout() {
        localStorage.removeItem("AUTH_TOKEN")
        localStorage.removeItem("AUTH_TOKEN_EXPIRE")
        router.push("/login", { scroll: false })
    }

    return (
        <header className={`${css["header"]}`}>
        <div className={`${css["title"]}`}>
            <button className={`${css["title-txt"]}`} onClick={() => router.push("/", { scroll: false })}>Кабинет</button>
            <button onClick={() => setSidebarCollapsed(prev => prev = !prev)}>
                <span className={`bi ${sidebarCollapsed ? "bi-layout-text-sidebar" : "bi-square"}`}></span>
            </button>
        </div>
        <button onClick={() => setIsToggled(prev => prev = !prev)} className={`${css["profile"]}`}>

            {showName()}
            <span className={`bi bi-person-circle`}></span>

            {!isToggled ?
                <></>:
                <div class="profile-line" aria-labelledby="navbarDropdown">
                    {showName()}
                    <div className={`${css["profile-line"]}`}></div>
                    <button onClick={logout}>
                        <span className={`bi bi-door-closed`}></span>
                        Выйти из кабинета
                    </button>
                </div>
            }
        </button>
        </header>
    )
}