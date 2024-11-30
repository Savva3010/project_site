"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/rooms/resident.module.css"

import { useEffect, useState, useReducer } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { location } from '@/enums';

import { SERVER_URL } from '@/globals';

import ImgBlurLoad from '@/components/shared/img-blur-load';
import Status from './status';

export default function Resident({ info }) {
    const router = useRouter()

    return (<>
        <div className={`${css["profile"]}`}>
            <ImgBlurLoad src={info?.profile_image?.src? SERVER_URL + info.profile_image.src : ""} hash={info?.profile_image?.blur_hash} className={`${css["blur-img"]}`} alt="Фото проживающего"/>

            <p><b>ФИО: </b>{                 info?.full_name    ? info["full_name"]    : <b>&minus;</b>}</p>
            <p><b>Возраст: </b>{             info?.age          ? info["age"]          : <b>&minus;</b>}</p>
            <p><b>Класс: </b>{               info?.class        ? info["class"]        : <b>&minus;</b>}</p>
            <p><b>Классный воспитатель: </b>{info?.class_mentor ? info["class_mentor"] : <b>&minus;</b>}</p>
            
            <p>&nbsp;</p>
            
            <button className={`${css["link"]}`} onClick={() => {
                let newParams = new URLSearchParams(`profile=${info?.id}`)
                router.push(`/residents/?${newParams.toString()}`)
            }}>Подробнее</button>
            <button className={`${css["link"]}`}>Заявления</button>
            <button className={`${css["link"]}`}>Журнал входов/выходов</button>

            <Status info={info?.status} />
        </div>
    </>);
}