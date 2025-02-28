"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/footer.module.css"

export default function Footer() {
    return (
        <footer className={`${css["footer"]}`}>
            <div>
                <span className={`${css["mob-shown"]}`}>
                    © <a href="https://anoo.ftl.name/" target="_blank">«Физтех-лицей»</a>
                </span>
                <span className={`${css["pc-shown"]}`}>
                    © <a href="https://anoo.ftl.name/" target="_blank">«Физтех-лицей»</a>, 2025
                </span>
                
            </div>
            <button>
                <span className={`bi bi-question-circle-fill ${css["mob-shown"]}`}></span>
                <span className={`bi bi-question-circle-fill ${css["pc-shown"]}`}>Помощь</span>
            </button>

            <a href="https://files.ftl.name/wl/?id=sNFB6Okj80DHORla7CGCwKmiLdtsO8DD" target="_blank">
                <span className={`${css["mob-shown"]}`}>Политика</span>
                <span className={`${css["pc-shown"]}`}>Политика обработки персональных данных</span>
            </a>
        </footer>
    )
}
