import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/footer.module.css"

export default function Footer() {
  return (
    <footer className={`${css["footer"]}`}>
      <div>
        © 
        <a href="https://anoo.ftl.name/" target="_blank">«Физтех-лицей»</a>
        , 2024
      </div>
      <button>
        <span className={`bi bi-question-circle-fill`}>Помощь</span>
      </button>
      <a href="#">Политика обработки персональных данных</a>
    </footer>
  )
}
