"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/journals/leave/record.module.css"

import { useEffect, useState, useReducer, useRef } from 'react';

import { journals_leave_status } from '@/enums';

export default function RecordStatus({ info }) {
    
    const status = journals_leave_status.getInfo(info)

    // Show component
    function showStatus() {
        if (!info) {
            return <div className={`${css["col3-status-status"]}`}>
                <p className={`${css["col3-no-status"]}`}>Нет данных</p>
            </div>
        }
        return <div className={`${css["col3-status-status"]} ${css[`col3-status-${status[1]}`]}`}>
                <p>{status[0]}</p>
            </div>
    }

    return (<>
        {showStatus()}
    </>);
}