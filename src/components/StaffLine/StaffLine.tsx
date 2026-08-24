import {useEffect, useRef, useState} from "react";
import {useMousePosition} from "../../contexts/MousePositionContext.tsx";
import {clamp} from "../../utils/mathUtils.ts";
import styles from "./StaffLine.module.css"
import {clsx} from "clsx";
import {type PitchClass, pitchClassToName} from "../../utils/notes.ts";
import {noteToColor} from "../../utils/visualization.ts";

export type StaffLineState = {
    isActive: boolean; modifier: -1 | 0 | 1; naturalPitchClass: PitchClass;
}

type StaffLineProps = {
    line: boolean;
    outOfBounds: boolean;
    totalLines: number;
    state: StaffLineState;
    setState: (state: StaffLineState) => void;
}

export function StaffLine({line, state, setState, outOfBounds, totalLines}: StaffLineProps) {
    // offset of the note from the left side of the staff line
    const [noteXOffset, setNoteXOffset] = useState<number | undefined>(undefined);
    const [lineHeigh, setLineHeight] = useState(10)

    const staffLineRef = useRef<HTMLDivElement | null>(null);
    const noteRef = useRef<SVGEllipseElement | null>(null);

    const mousePosition = useMousePosition();

    useEffect(() => {
        if (state.isActive || !staffLineRef.current || !noteRef.current || !mousePosition[0]) {
            return
        }

        const staffLineBoundingBox = staffLineRef.current.getBoundingClientRect()
        const noteBoundingBox = noteRef.current.getBoundingClientRect()

        const staffLineWidth = staffLineBoundingBox.width ?? 0
        const noteWidth = noteBoundingBox?.width ?? 0

        setNoteXOffset(clamp(mousePosition[0] - (staffLineBoundingBox.x), noteWidth / 2, staffLineWidth - noteWidth / 2))
    }, [state.isActive, mousePosition]);

    useEffect(() => {
        const handleResize = () => {
            setLineHeight(document.body.clientHeight / (totalLines + 10))
        }
        handleResize()

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [totalLines])

    function toggleNote() {
        setState({...state, isActive: !state.isActive})
    }

    function toggleModifier(newModifier: -1 | 0 | 1): void {
        if (state.modifier == 0 || state.modifier != newModifier) {
            setState({...state, modifier: newModifier})
        } else {
            setState({...state, modifier: 0})
        }
    }

    return <div className={styles.staffLineContainer} style={{
        height: lineHeigh,
    }}>
        {/* Pre- NoteSelector */}
        <div className={styles.preNoteSelector} style={{
            fontSize: lineHeigh * 0.8
        }}>
            <p className={clsx(state.modifier == -1 && styles.active)} onClick={() => toggleModifier(-1)}>♭</p>
            <p className={clsx(state.modifier == 1 && styles.active)} onClick={() => toggleModifier(1)}>#</p>
            <p className={styles.lineNoteNameText}>{pitchClassToName(state.naturalPitchClass + state.modifier as PitchClass)}</p>
        </div>

        {/* Note Selector */}
        <div ref={staffLineRef}
             className={clsx(styles.noteSelector, line && styles.linedStaffLine, outOfBounds && styles.outOfBounds)}
             onClick={toggleNote}>
            <svg className={clsx(styles.noteSVG)}>
                <ellipse rx={lineHeigh * 1.5} ry={lineHeigh} cx={noteXOffset} cy={lineHeigh / 2}
                         className={clsx(styles.note, state.isActive && styles.activeNote)} ref={noteRef}
                         fill={noteToColor(state.naturalPitchClass + state.modifier as PitchClass)}/>
            </svg>
        </div>
    </div>
}