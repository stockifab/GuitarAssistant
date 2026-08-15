import {useEffect, useRef, useState} from "react";
import {useMousePosition} from "../../contexts/MousePositionContext.tsx";
import {clamp} from "../../utils/mathUtils.ts";
import styles from "./StaffLine.module.css"
import {clsx} from "clsx";
import {type PitchClass, pitchClassToName, type StaffIdx, staffIdxToPitchClass} from "../../utils/notes.ts";

export type StaffLineState = {
    showNote: boolean;
    modifier: -1 | 0 | 1;
    naturalPitchClass: PitchClass;
}

type StaffLineProps = {
    line: boolean;
    staffIdx: StaffIdx;
    onChange: (state: StaffLineState) => void;
}

export function StaffLine({line, staffIdx, onChange}: StaffLineProps) {
    const [showNote, setShowNote] = useState<boolean>(false)
    const [modifier, setModifier] = useState<-1 | 0 | 1>(0);
    // offset of the note from the left side of the staff line
    const [noteXOffset, setNoteXOffset] = useState(0)

    const mousePosition = useMousePosition();

    const staffLineRef = useRef<HTMLDivElement | null>(null);
    const noteRef = useRef<SVGEllipseElement | null>(null);

    // update note position to match mouse unless it's selected
    useEffect(() => {
        if (showNote) {
            return
        }

        const staffLineBoundingBox = staffLineRef.current?.getBoundingClientRect()
        const noteBoundingBox = noteRef.current?.getBoundingClientRect()

        const staffLineWidth = staffLineBoundingBox?.width ?? 0
        const noteWidth = noteBoundingBox?.width ?? 0

        setNoteXOffset(clamp(mousePosition[0] - (staffLineBoundingBox?.x ?? 0), noteWidth / 2, staffLineWidth - noteWidth / 2))
    }, [showNote, mousePosition]);

    useEffect(() => {
        onChange({showNote, modifier, naturalPitchClass: staffIdxToPitchClass(staffIdx)})
    }, [showNote, modifier, staffIdx]);

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

    return <div className={styles.staffLineContainer} ref={staffLineRef}>
        {/* Pre- NoteSelector */}
        <div className={styles.preNoteSelector}>
            <p className={clsx(modifier == -1 && styles.active)} onClick={() => toggleModifier(-1)}>♭</p>
            <p className={clsx(modifier == 1 && styles.active)} onClick={() => toggleModifier(1)}>#</p>
            <p className={styles.lineNoteNameText}>{pitchClassToName((staffIdxToPitchClass(staffIdx) + modifier) as PitchClass)}</p>
        </div>

        {/* Note Selector */}
        <div className={clsx(styles.noteSelector, line && styles.linedStaffLine)} onClick={toggleNote}>
            <svg className={clsx(styles.noteSVG)}>
                <ellipse rx="21" ry="15" cx={noteXOffset} cy="7.5"
                         className={clsx(styles.note, showNote && styles.activeNote)} ref={noteRef}/>
            </svg>
        </div>
    </div>
}