"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/sidebar.module.css"

import SidebarCatalog from './sidebar-catalog';

export default function Sidebar({ collapsed }) {
    return (
        <div className={`${css["sidebar"]} ${!collapsed ? css["mob-show"] : ""}`}>
            <SidebarCatalog name="Список проживающих" href="/residents" />
            <SidebarCatalog name="Сведения о комнатах" href="/rooms" />
            <SidebarCatalog name="Журналы">
                <SidebarCatalog name="Вход/выход" href="/journals/leave" />
                <SidebarCatalog name="Уборка комнат" href="/journals/cleaning" />
            </SidebarCatalog>
            <SidebarCatalog name="Заявления на выход" href="/applications/leave" />
        </div>
    )
}
