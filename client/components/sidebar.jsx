"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/sidebar.module.css"

import SidebarCatalog from './sidebar-catalog';

export default function Sidebar() {
    return (
        <div className={`${css["sidebar"]}`}>
            <SidebarCatalog name="Список проживающих" href="/residents" />
            <SidebarCatalog name="Сведения о комнатах" href="/" />
            <SidebarCatalog name="Журналы">
                <SidebarCatalog name="Вход/выход" href="/" />
                <SidebarCatalog name="Уборка комнат" href="/journals/cleaning" />
            </SidebarCatalog>
            <SidebarCatalog name="Заявления на выход" href="/" />
        </div>
    )
}
