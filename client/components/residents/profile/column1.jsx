"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/profile.module.css"

import { useEffect, useState, useReducer } from 'react';

import ImgBlurLoad from '@/components/shared/img-blur-load';

import { SERVER_URL, CLIENT_URL, IMG_PLACEHOLDER } from '@/globals';

export default function Column1({ info }) {

    return (<>
        <div className={`${css["col"]} ${css["col1"]}`}>
            <ImgBlurLoad src={info?.profile_image?.src? SERVER_URL + info.profile_image.src : ""} hash={info?.profile_image?.blur_hash} className={`${css["col1-blur-img"]}`} alt="Фото проживающего"/>
        </div>
    </>);
}