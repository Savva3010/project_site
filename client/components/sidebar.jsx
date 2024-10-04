import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/sidebar.module.css"

import SidebarCatalog from './sidebar-catalog';

export default function Sidebar() {
    return (
        <div className={`${css["sidebar"]}`}>
            <SidebarCatalog name="Список проживающих" href="/a" />
            <SidebarCatalog name="Сведения о комнатах" href="/b" />
            <SidebarCatalog name="Журналы">
                <SidebarCatalog name="Вход/выход" href="/c" />
                <SidebarCatalog name="Уборка комнат" href="/d" />
            </SidebarCatalog>
            <SidebarCatalog name="Заявления на выход" href="/e" />
        </div>
    )
}
