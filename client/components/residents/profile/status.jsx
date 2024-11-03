"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/profile.module.css"

import { useEffect, useState, useReducer, useRef } from 'react';

import { location } from '@/enums';

import List from "@/cmponents/residents/list"
import Profile from '@/cmponents/residents/profile/profile';


export default function Status({ info }) {
    
    const status = location.getInfo(info?.status?.status)
    const lateness = info?.status?.lateness || 0

    function statusLatenessClass() {
        if (lateness >= 30) {
            return css["col2-status-status-late-30"]
        }
        if (lateness) {
            return css["col2-status-status-late"]
        }
        return css[`col2-status-status-${status[1]}`]
    }

    function minuteTextForm() {
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

    function statusText() {
        if (lateness) {
            return `Опоздание ${lateness} ${minuteTextForm()}`
        }
        return status[0]
    }

    function wrapperLatenessClass() {
        if (lateness >= 30) {
            return css["col2-status-wrapper-late-30"]
        }
        if (lateness) {
            return css["col2-status-wrapper-late"]
        }
        return ""
    }

    function showStatus() {
        if (!info?.status?.status) return <div className={`${css["col2-status-wrapper"]}`}>
                <div className={`${css["col2-status-status"]}`}>
                    <p className={`${css["col2-no-status"]}`}>Нет данных</p>
                </div>
            </div>

        return <div className={`${css["col2-status-wrapper"]} ${wrapperLatenessClass()}`}>
            <div className={`${css["col2-status-status"]} ${statusLatenessClass()}`}>
                <p>{statusText()}</p>
            </div>
            {status[1] == "inside" || status[1] == "isolator" ?
            <></> :
            <p>В {status[1] == "school" ? "ФТЛ" : info?.status?.place} до {info?.status?.until}</p>}
        </div>
    }

    return (<>
        {showStatus()}
    </>);
}