import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/sidebar.module.css"

export default function SidebarCatalog({name, subCategories = []}) {

  return (
    <div className={`${css["sidebar-catalog"]}`}>
        <span className={`${css["sidebar-catalog-name"]}`}>
            {name}
            {subCategories.length != 0
            ? <span className={`bi bi-caret-right-fill`}></span>
            : <span></span>
            }
        </span>
      {subCategories.map((element, key) => {
        return <SidebarCatalog key={key} name={element["name"]} subCategories={element.subCategories} />
      })}
    </div>
  )
}
