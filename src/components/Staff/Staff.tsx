import styles from "./Staff.module.css"
import {clsx} from "clsx";
import {useState} from "react";

type StaffProps = {
    line: boolean;
}

function StaffLine({line}: StaffProps) {
    const [showNote, setShowNote] = useState<boolean>(false)

    function toggleNote() {
        setShowNote(!showNote)
    }

    return <div className={clsx(styles.staffLine, line && styles.visibleLine)} onClick={toggleNote}>
        <svg className={clsx(styles.note, showNote && styles.visibleNote)}>
            <ellipse rx="21" ry="15" cy="7.5"/>
        </svg>
    </div>
}

export function Staff() {
    return (
        <div className={styles.staffContainer}>
            <StaffLine line={true}/>
            <StaffLine line={false}/>
            <StaffLine line={true}/>
            <StaffLine line={false}/>
            <StaffLine line={true}/>
            <StaffLine line={false}/>
            <StaffLine line={true}/>
            <StaffLine line={false}/>
            <StaffLine line={true}/>
        </div>)
}