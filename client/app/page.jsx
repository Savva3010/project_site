"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/page.module.css"

import { useContext } from 'react';

import { useRouter } from 'next/navigation';

import { CurrentUser } from '@/layout';

export default function Home() {

    const currentUser = useContext(CurrentUser)

    const router = useRouter()

    return (<>
        <div className={`${css["wrapper"]}`}>
            <p><b>Главная страница</b></p>
            <p>Добро пожаловать в личный кабинет, <b>{`${currentUser.surname || ""} ${currentUser.name || ""} ${currentUser.lastname || ""}`}</b></p>

            &nbsp;

            <button onClick={() => 
                router.push("/residents", { scroll: false })
            }>Список проживающих</button>

            <button onClick={() => 
                router.push("/rooms", { scroll: false })
            }>Сведения о комнатах</button>

            <button onClick={() => 
                router.push("/journals/leave", { scroll: false })
            }>Журнал входов/выходов</button>

            <button onClick={() => 
                router.push("/journals/cleaning", { scroll: false })
            }>Журнал оценок за уборку комнат</button>

            <button onClick={() => 
                router.push("/applications/leave", { scroll: false })
            }>Заявления на выход</button>

            <button onClick={() => 
                router.push("/", { scroll: false })
            }>Карта интерната</button>
        </div>
    </>);
}
