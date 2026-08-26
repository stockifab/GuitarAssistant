import styles from "./MobileWarning.module.css"
import {type ReactNode, useEffect, useState} from "react";

function showMobileWarning(): boolean {
    return window.innerWidth < 1400
}

export function MobileWarning({children}: { children: ReactNode }) {
    const [visible, setVisible] = useState(showMobileWarning())

    useEffect(() => {
        const handleResize = () => setVisible(showMobileWarning())

        window.addEventListener("resize", handleResize)

        return () => window.removeEventListener("resize", handleResize)
    }, []);

    if (!visible) {
        return children
    }

    return <div className={styles.warningContainer}>
        <h1>Dear Visitor!</h1>
        <p>Thank you for checking out Guitar Assistant!</p>
        <p>Please note that this website is not designed for narrow screens like yours - You can still use it, but please keep
            in mind your experience will only be great on desktop.</p>
        <p>I apologize for the inconvenience.</p>
        <button onClick={() => setVisible(false)}>I understand & proceed</button>
    </div>
}