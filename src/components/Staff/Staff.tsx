import styles from "./Staff.module.css"
import {clsx} from "clsx";
import {useState} from "react";
import {pitchClassToName, staffIdxToPitchClass} from "../../notes.ts";

type StaffLineProps = {
    line: boolean; staffIdx: number;
}

function StaffLine({line, staffIdx}: StaffLineProps) {
    const [showNote, setShowNote] = useState<boolean>(false)
    const [modifier, setModifier] = useState<-1 | 0 | 1>(0);

    function toggleNote() {
        setShowNote(!showNote)
    }

    function toggleModifier(newModifier: -1 | 0 | 1): void {
        if (modifier == 0 || modifier != newModifier) {
            setModifier(newModifier)
        } else {
            setModifier(0)
        }
    }

    return <div className={styles.staffLineContainer}>
        {/* Pre- NoteSelector */}
        <div className={styles.preNoteSelector}>
            <p className={clsx(modifier == -1 && styles.active)} onClick={() => toggleModifier(-1)}>♭</p>
            <p className={clsx(modifier == 1 && styles.active)} onClick={() => toggleModifier(1)}>#</p>
            <p className={styles.lineNoteNameText}>{pitchClassToName(staffIdxToPitchClass(staffIdx) + modifier)}</p>
        </div>

        {/* Note Selector */}
        <div className={clsx(styles.noteSelector, line && styles.linedStaffLine)} onClick={toggleNote}>
            <svg className={clsx(styles.noteSVG)}>
                <ellipse rx="21" ry="15" cx="0" cy="7.5" className={clsx(styles.note, showNote && styles.activeNote)}/>
            </svg>
        </div>
    </div>
}

type StaffProps = {
    startStaffIdx: number; endStaffIdx: number;
}

export function Staff({startStaffIdx, endStaffIdx}: StaffProps) {
    return (<div className={styles.staffContainer}>
        {[...Array(endStaffIdx - startStaffIdx)].map((_, i) => (
            <StaffLine line={i % 2 != 0} staffIdx={endStaffIdx - i}/>))}
    </div>)
}