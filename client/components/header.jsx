"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/header.module.css"

import { useContext } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import { CurrentUser } from '@/layout';

export default function Header() {

    const currentUser = useContext(CurrentUser)

    const router = useRouter()
    const pathname = usePathname()

    function showName() {
        if (pathname === "/login") {
            return <p>Войти</p>
        }
        if (currentUser) {
            return <p>{`${currentUser.surname} ${currentUser.name}`}</p>
        }
        return <p>Загрузка...</p>
    }

    return (
        <header className={`${css["header"]}`}>
        <div className={`${css["title"]}`}>
            <button className={`${css["title-txt"]}`} onClick={() => router.push("/", { scroll: false })}>Кабинет</button>
            <button>
            <span className={`bi bi-layout-text-sidebar`}></span>
            </button>
        </div>
        <button className={`${css["profile"]}`}>
            {showName()}
            <span className={`bi bi-person-circle`}></span>
        </button>
        </header>
    )
}