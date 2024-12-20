"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/header.module.css"

import { useRouter } from 'next/navigation';

export default function Header() {

    const router = useRouter()

    return (
        <header className={`${css["header"]}`}>
        <div className={`${css["title"]}`}>
            <button className={`${css["title-txt"]}`} onClick={() => router.push("/", { scroll: false })}>Кабинет</button>
            <button>
            <span className={`bi bi-layout-text-sidebar`}></span>
            </button>
        </div>
        <button className={`${css["profile"]}`}>
            <p>Серебренников Савва</p>
            <span className={`bi bi-person-circle`}></span>
        </button>
        </header>
    )
}