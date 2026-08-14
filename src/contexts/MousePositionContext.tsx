import {createContext, use, useEffect, useState} from "react";

const MousePositionContext = createContext<[number, number]>([0, 0]);

export function MouseContextProvider({children}: { children: React.ReactNode }) {
    const [mousePosition, setMousePosition] = useState<[number, number]>([0, 0])

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            setMousePosition([e.clientX, e.clientY])
        }

        document.addEventListener("mousemove", onMouseMove)

        return () => document.removeEventListener("mousemove", onMouseMove)
    })

    return <MousePositionContext value={mousePosition}>
        {children}
    </MousePositionContext>
}

export function useMousePosition() {
    return use(MousePositionContext)
}