"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/residents/profile.module.css"

import { useEffect, useState, useReducer } from 'react';

import { SERVER_URL, CLIENT_URL, IMG_PLACEHOLDER, IMG_PLACEHOLDER_BLURHASH } from '@/globals';

import { Blurhash } from "react-blurhash";

export default function ImgBlurLoad({ src, hash, className, alt }) {

    const [ status, setStatus ] = useState("UNLOADED")

    useEffect(() => {
        setStatus("UNLOADED")
        const img = new Image()
        const errImg = new Image()
        img.onload = () => {
            setStatus("LOADED")
        }
        errImg.onload = () => {
            setStatus("ERROR")
        }
        errImg.onerror = () => {
            setStatus("ERROR")
        }
        img.onerror = () => {
            errImg.src = IMG_PLACEHOLDER
        }
        img.src = src;

        return () => {
            img.src = ""
            img.remove()
            errImg.src = ""
            errImg.remove()
        }
    }, [src])

    function showImg() {
        switch (status) {
            case "UNLOADED":
                return <div className={className}>
                    <Blurhash
                        hash={hash? hash : IMG_PLACEHOLDER_BLURHASH}
                        width="100%"
                        height="100%"
                        resolutionX={32}
                        resolutionY={32}
                        punch={1}
                    />
                </div>
            case "LOADED":
                return <img src={src} alt={alt} loading="lazy" />
            case "ERROR":
                return <img src={IMG_PLACEHOLDER} alt="Не удалось загрузить фото" loading="lazy" />
        }
    }

    return (<>
        {showImg()}
    </>);
}