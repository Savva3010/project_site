"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/profile.module.css"

import { useEffect, useState, useReducer } from 'react';

import { location } from '@/enums';

const URL = "http://localhost:3001"
const IMG_PLACEHOLDER = "/no_img.png"

export default function ProfileColumn1({ info }) {

    return (<>
        <div className={`${css["profile-col1"]}`}>
            <img src={URL + info["profile_image"]} alt="Не удалось загрузить фото" srcset="" onError={(event) => event.target.src = URL + IMG_PLACEHOLDERz} />
        </div>
    </>);
}