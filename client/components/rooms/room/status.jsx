"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/rooms/resident.module.css"

import { useEffect, useState, useReducer, useRef } from 'react';

import { location } from '@/enums';

// Css class color based on lateness
function statusLatenessClass(lateness, status) {
    if (lateness >= 30) {
        return css["status-status-late-30"]
    }
    if (lateness) {
        return css["status-status-late"]
    }
    return css[`status-status-${status[1]}`]
}

// Correct form of "minute" based on lateness
function minuteTextForm(lateness) {
    if (10 <= lateness && lateness <= 20) {
        return "минут"
    }
    if (lateness % 10 == 0 || 5 <= lateness % 10 && lateness % 10 <= 9) {
        return "минут"
    }
    if (lateness % 10 == 1) {
        return "минута"
    }
    return "минуты"
}

// Css wrapper class color based on lateness
function wrapperLatenessClass(lateness) {
    if (lateness >= 30) {
        return css["status-wrapper-late-30"]
    }
    if (lateness) {
        return css["status-wrapper-late"]
    }
    return ""
}

// "Late by x minutes" text
function statusText(lateness, status) {
    if (lateness) {
        return `Опоздание ${lateness} ${minuteTextForm(lateness)}`
    }
    return status[0]
}

export default function Status({ info }) {
    
    const status = location.getInfo(info?.status)
    const lateness = info?.lateness || 0

    // Show component
    function showStatus() {
        if (!info?.status) {
            return <div className={`${css["status-wrapper"]}`}>
                <div className={`${css["status-status"]}`}>
                    <p className={`${css["no-status"]}`}>Нет данных</p>
                </div>
            </div>
        }
        return <div className={`${css["status-wrapper"]} ${wrapperLatenessClass(lateness)}`}>
            <div className={`${css["status-status"]} ${statusLatenessClass(lateness, status)}`}>
                <p>{statusText(lateness, status)}</p>
            </div>
            {status[1] == "inside" || status[1] == "isolator" ?
            <></> :
            <p>В {status[1] == "school" ? "ФТЛ" : info?.place} до {info?.until}</p>}
        </div>
    }

    return (<>
        {showStatus()}
    </>);
}