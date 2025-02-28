"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/sidebar.module.css"

import { Children, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SidebarCatalog({name, href, children = []}) {

    const [ expanded, setExpanded ] = useState(false)
    const router = useRouter()

    // If is catalog, then toggle open/close
    function showExpanded() {
        if (!expanded) return (<></>)

        return (<>
            {Children.map(children, (element, key) => {
                return <SidebarCatalog key={key} name={element.props.name} href={element.props.href}>{element.props.children}</SidebarCatalog>
            })}
        </>)
    }

    // Handle click based on catalog/link
    function handleClick() {
        if (Children.count(children) != 0) {
            setExpanded(prev => prev = !prev)
        } else {
            router.push(href)
        }
    }

    return (
        <div className={`${css["sidebar-catalog"]}`}>
            <button onClick={handleClick} className={`${css["sidebar-catalog-name"]}`}>
                {name}
                {Children.count(children) != 0
                    ? <span className={`bi ${expanded ? "bi-caret-down-fill" : "bi-caret-right-fill"}`}></span>
                    : <></>
                }
            </button>
            {showExpanded()}
        </div>
    )
}
