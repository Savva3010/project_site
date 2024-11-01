"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/profile.module.css"

import { useEffect, useState, useReducer } from 'react';

export default function Column2({ info }) {

    return (<>
        <div className={`${css["profile-col2"]}`}>
            <div className={`${css["profile-col2-row"]}`}>
                <div className={`${css["profile-col2-resident"]}`}>
                    <p><b>ФИО: </b>{info["full_name"] ? info["full_name"] : "-"}</p>
                    <p><b>Возраст: </b>{info["full_name"] ? info["full_name"] : "-"}</p>
                    <p><b>Комната: </b>{info["full_name"] ? info["full_name"] : "-"}</p>
                    <p><b>Класс: </b>{info["full_name"] ? info["full_name"] : "-"}</p>
                    <p><b>Классный руководитель: </b>{info["full_name"] ? info["full_name"] : "-"}</p>
                    <p><b>Классный воспитатель: </b>{info["full_name"] ? info["full_name"] : "-"}</p>
                    <p><b>Номер тел.: </b>{info["full_name"] ? info["full_name"] : "-"}</p>
                    <p><b>Почта: </b>{info["full_name"] ? info["full_name"] : "-"}</p>
                    <p><b>Telegram: </b>{info["full_name"] ? info["full_name"] : "-"}</p>
                </div>
                <div className={`${css["profile-col2-parents"]}`}>
                
                </div>
            </div>
        </div>
    </>);
}