import {useEffect, useMemo, useRef, useState} from "react";
import {useMousePosition} from "../../contexts/MousePositionContext.tsx";
import {clamp} from "../../utils/mathUtils.ts";
import styles from "./StaffLine.module.css"
import {clsx} from "clsx";
import {type PitchClass, pitchClassToName, type StaffIdx, staffIdxToPitchClass} from "../../utils/notes.ts";
import {noteToColor} from "../../utils/visualization.ts";

export type StaffLineState = {
    showNote: boolean;
    modifier: -1 | 0 | 1;
    naturalPitchClass: PitchClass;
}

type StaffLineProps = {
    line: boolean;
    staffIdx: StaffIdx;
    onChange: (state: StaffLineState) => void;
    outOfBounds: boolean;
}

export function StaffLine({line, staffIdx, onChange, outOfBounds}: StaffLineProps) {
    const [showNote, setShowNote] = useState<boolean>(false)
    const [modifier, setModifier] = useState<-1 | 0 | 1>(0);
    // offset of the note from the left side of the staff line
    const [noteXOffset, setNoteXOffset] = useState<number | undefined>(undefined);

    const mousePosition = useMousePosition();

    const staffLineRef = useRef<HTMLDivElement | null>(null);
    const noteRef = useRef<SVGEllipseElement | null>(null);
    const pitchClass = useMemo(() => staffIdxToPitchClass(staffIdx) + modifier as PitchClass, [staffIdx, modifier])

    useEffect(() => {
        if (showNote || !staffLineRef.current || !noteRef.current || !mousePosition[0]) {
            return
        }

        const staffLineBoundingBox = staffLineRef.current.getBoundingClientRect()
        const noteBoundingBox = noteRef.current.getBoundingClientRect()

        const staffLineWidth = staffLineBoundingBox.width ?? 0
        const noteWidth = noteBoundingBox?.width ?? 0

        setNoteXOffset(clamp(mousePosition[0] - (staffLineBoundingBox.x), noteWidth / 2, staffLineWidth - noteWidth / 2))
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

    return <div className={styles.staffLineContainer}>
        {/* Pre- NoteSelector */}
        <div className={styles.preNoteSelector}>
            <p className={clsx(modifier == -1 && styles.active)} onClick={() => toggleModifier(-1)}>♭</p>
            <p className={clsx(modifier == 1 && styles.active)} onClick={() => toggleModifier(1)}>#</p>
            <p className={styles.lineNoteNameText}>{pitchClassToName((staffIdxToPitchClass(staffIdx) + modifier) as PitchClass)}</p>
        </div>

        {/* Note Selector */}
        <div ref={staffLineRef}
             className={clsx(styles.noteSelector, line && styles.linedStaffLine, outOfBounds && styles.outOfBounds)}
             onClick={toggleNote}>
            <svg className={clsx(styles.noteSVG)}>
                <ellipse rx="45" ry="35" cx={noteXOffset} cy="17.5"
                         className={clsx(styles.note, showNote && styles.activeNote)} ref={noteRef}
                         fill={noteToColor(pitchClass)}/>
            </svg>
        </div>
    </div>
}