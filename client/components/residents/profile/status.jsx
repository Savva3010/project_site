"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/profile.module.css"

import { useEffect, useState, useReducer, useRef } from 'react';

import unixToString from '@/lib/unixToString';

import { location } from '@/enums';

// Css class color based on lateness
function statusLatenessClass(lateness, status) {
    if (lateness >= 30) {
        return css["col2-status-status-late-30"]
    }
    if (lateness) {
        return css["col2-status-status-late"]
    }
    return css[`col2-status-status-${status[1]}`]
}

// Correct form of "minute" based on lateness
function minuteTextForm(lateness) {
    if (10 <= lateness % 100 && lateness % 100 <= 20) {
        return "минут"
    }
    if (lateness % 10 === 0 || 5 <= lateness % 10 && lateness % 10 <= 9) {
        return "минут"
    }
    if (lateness % 10 === 1) {
        return "минута"
    }
    return "минуты"
}

// Css wrapper class color based on lateness
function wrapperLatenessClass(lateness) {

    if (lateness >= 30) {
        return css["col2-status-wrapper-late-30"]
    }
    if (lateness) {
        return css["col2-status-wrapper-late"]
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
    
    let untilDate = new Date(info?.until || 0)
    let status = location.getInfo(info?.status)
    let lateness = Math.max(0, Math.floor((Date.now() - untilDate.getTime()) / 1000 / 60))
    if (status[1] === "inside" || status[1] === "isolator") lateness = 0

    // Show component
    function showStatus() {
        if (!info?.status) {
            return <div className={`${css["col2-status-wrapper"]}`}>
                <div className={`${css["col2-status-status"]}`}>
                    <p className={`${css["col2-no-status"]}`}>Нет данных</p>
                </div>
            </div>
        }
        return <div className={`${css["col2-status-wrapper"]} ${wrapperLatenessClass(lateness)}`}>
            <div className={`${css["col2-status-status"]} ${statusLatenessClass(lateness, status)}`}>
                <p>{statusText(lateness, status)}</p>
            </div>
            {status[1] === "inside" || status[1] === "isolator" ?
            <></> :
            <p>В {status[1] === "school" ? "ФТЛ" : info?.place} до {unixToString(untilDate)}</p>}
        </div>
    }

    return (<>
        {showStatus()}
    </>);
}