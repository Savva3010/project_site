import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/header.module.css"

export default function Header() {
  return (
    <header className={`${css["header"]}`}>
      <div className={`${css["title"]}`}>
        <a href="https://cabinet.ftl.name" className={`${css["title-txt"]}`}>Кабинет</a>
        <span className={`bi bi-layout-text-sidebar`}></span>
      </div>
      <div className={`${css["profile"]}`}>
        <p>Серебренников Савва</p>
        <span className={`bi bi-person-circle`}></span>
      </div>
    </header>
  )
}