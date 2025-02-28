import { useState } from "react";

export default function forceRerender() {
    const [ state, setState ] = useState(false)

    return () => {
        setState(prev => prev = !prev)
    }
}