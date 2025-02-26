"use client"

import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "@/styles/journals/cleaning/mark-modal.module.css"

import { useEffect, useState, useReducer } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { location } from '@/enums';

import { SERVER_URL } from '@/globals';

export default function MarkModal({ setMark, isInv }) {

    return (<>
        <div className={`${css["wrapper"]} ${isInv ? css["inv"] : ""}`}>
            <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.838835 0.8389L35.01 19.7007L19.7007 35.0101L0.838835 0.8389Z" fill="white"/>
            </svg>

            <div>
                <button onClick={() => setMark(0)}>&minus;</button>
                <button onClick={() => setMark(1)}>1</button>
                <button onClick={() => setMark(2)}>2</button>
                <button onClick={() => setMark(3)}>3</button>
                <button onClick={() => setMark(4)}>4</button>
                <button onClick={() => setMark(5)}>5</button>
            </div>
        </div>
    </>);
}