"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/applications/leave/application.module.css"

import { useEffect, useState, useReducer, useRef } from 'react';

import { application_leave_status } from '@/enums';

export default function ApplicationStatus({ info }) {
    
    const status = application_leave_status.getInfo(info)

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