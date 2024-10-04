import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/sidebar.module.css"

import SidebarCatalog from './sidebar-catalog';

export default function Sidebar() {
  return (
    <div className={`${css["sidebar"]}`}>
      <SidebarCatalog name="Список проживающих" subCategories={[]} />
      <SidebarCatalog name="Сведения о комнатах" subCategories={[]} />
      <SidebarCatalog name="Журналы" subCategories={[
        {"name": "Вход/выход", subCategories: []},
        {"name": "Уборка комнат", subCategories: []}
        ]} />
        
      <SidebarCatalog name="Заявления на выход" subCategories={[]}/>
    </div>
  )
}
