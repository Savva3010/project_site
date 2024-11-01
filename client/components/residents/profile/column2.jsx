"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/profile.module.css"

import { useEffect, useState, useReducer } from 'react';

export default function Column2({ info }) {

    return (<>
        <div className={`${css["col"]} ${css["col2"]}`}>
            <div className={`${css["col2-row"]}`}>
                <div className={`${css["col2-resident"]}`}>
                    <p><b>ФИО: </b>{                  info?.full_name     ? info["full_name"]     : <b>&minus;</b>}</p>
                    <p><b>Возраст: </b>{              info?.age           ? info["age"]           : <b>&minus;</b>}</p>
                    <p><b>Комната: </b>{              info?.room          ? info["room"]          : <b>&minus;</b>}</p>
                    <p><b>Класс: </b>{                info?.class         ? info["class"]         : <b>&minus;</b>}</p>
                    <p><b>Классный руководитель: </b>{info?.class_teacher ? info["class_teacher"] : <b>&minus;</b>}</p>
                    <p><b>Классный воспитатель: </b>{ info?.class_mentor  ? info["class_mentor"]  : <b>&minus;</b>}</p>
                    <p><b>Номер тел.: </b>{           info?.mobile        ? info["mobile"]        : <b>&minus;</b>}</p>
                    <p><b>Почта: </b>{                info?.email         ? info["email"]         : <b>&minus;</b>}</p>
                    <p><b>Telegram: </b>{             info?.telegram      ? info["telegram"]      : <b>&minus;</b>}</p>
                </div>

                <div className={`${css["col2-parents"]}`}>
                    <p><b>Родители</b></p>
                    {info?.parents?.map((parent, idx) => {
                        return (<div className={`${css["col2-parent"]}`}>
                            <p>{parent?.full_name ? parent["full_name"] : <b>&minus;</b>}</p>
                            <p>{parent?.mobile    ? parent["mobile"]    : <b>&minus;</b>}</p>
                            <p>{parent?.email     ? parent["email"]     : <b>&minus;</b>}</p>
                            <p>{parent?.telegram  ? parent["telegram"]  : <b>&minus;</b>}</p>
                        </div>)
                    })}
                </div>
            </div>
        </div>
    </>);
}