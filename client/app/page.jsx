"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/page.module.css"

import { useRouter } from 'next/navigation';

export default function Home() {

    const router = useRouter()

    return (<>
        <div className={`${css["wrapper"]}`}>
            <p><b>Главная страница</b></p>
            <p>Добро пожаловать в личный кабинет, <b>Иванов Иван Иванович</b></p>

            &nbsp;

            <button onClick={() => 
                router.push("/residents", { scroll: false })
            }>Список проживающих</button>

            <button onClick={() => 
                router.push("/rooms", { scroll: false })
            }>Сведения о комнатах</button>

            <button onClick={() => 
                router.push("/", { scroll: false })
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
