"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/applications/leave/application.module.css"

import { useEffect, useState, useReducer, useMemo } from 'react';

import File from './file';

import { SERVER_URL, WS_SERVER_URL } from '@/globals';

export default function Files({ info }) {

    return (<>
        <div className={`${css["filex"]}`}>
            <div>Files</div>
            <File info={info} />
        </div>
    </>);
}