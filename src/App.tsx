import {Staff} from "./components/Staff/Staff.tsx";
import {Fretboard, type FretboardState} from "./components/Fretboard/Fretboard.tsx";
import {nameToPitchClass, type PitchClass, pitchClassToStaffIdx, type StaffIdx} from "./utils/notes.ts";
import type {StaffLineState} from "./components/StaffLine/StaffLine.tsx";
import {useEffect, useMemo, useState} from "react";
import {type FretboardString, FretboardVisualization} from "./lib/FretboardVisualization.ts";
import styles from "./App.module.css"
import {Trash2} from "lucide-react";

const GUITAR_TUNING = [
    nameToPitchClass("E3"),
    nameToPitchClass("A3"),
    nameToPitchClass("D4"),
    nameToPitchClass("G4"),
    nameToPitchClass("H4"),
    nameToPitchClass("E5"),
]

const FRET_COUNT = 12

function getActiveNotes(staffState: Map<StaffIdx, StaffLineState>) {
    let activeNotes: PitchClass[] = []
    for (const [_, state] of staffState) {
        if (state.isActive) {
            activeNotes.push(state.naturalPitchClass + state.modifier as PitchClass)
        }
    }

    return activeNotes
}

export function App() {
    const [tuning, setTuning] = useState<PitchClass[]>(GUITAR_TUNING)
    const [staffState, setStaffState] = useState(new Map<StaffIdx, StaffLineState>())
    const [fretCount, setFretCount] = useState(FRET_COUNT)
    const [fretboardState, setFretboardState] = useState<FretboardState>({
        stringsCount: 6,
        fretCount: FRET_COUNT,
        dots: new Map(),
        stringsHighlights: new Map(),
    })

    function updateVisualization() {
        const activeNotes = getActiveNotes(staffState)

        const newState = new FretboardVisualization(tuning as FretboardString[], fretCount)
            .noteDots(activeNotes)
            .stringHighlight(activeNotes)
            .toFretboardState()

        setFretboardState(newState)
    }

    useEffect(() => {
        updateVisualization()
    }, [staffState, tuning, fretCount]);

    const {startStaffIdx, endStaffIdx} = useMemo(() => {
        return {
            startStaffIdx: pitchClassToStaffIdx(Math.min(...tuning) - 1 as PitchClass),
            endStaffIdx: pitchClassToStaffIdx(Math.max(...tuning) + fretboardState.fretCount as PitchClass),
        }
    }, [tuning, fretboardState])

    return <div className={styles.main}>
        <div className={styles.staffContainer}>
            <Staff startStaffIdx={startStaffIdx}
                   endStaffIdx={endStaffIdx}
                   isOutOfBounds={(idx: StaffIdx) => idx > 4 || idx < -6}
                   staffState={staffState}
                   setStaffState={setStaffState}/>
            <button onClick={() => setStaffState(new Map())} className={styles.clearStaffButton}><Trash2 /> Clear Staff</button>
        </div>
        <Fretboard initialWidth={120}
                   height={230}
                   fretboardState={fretboardState}
                   setFretCount={setFretCount}
                   tuning={tuning}
                   setTuning={setTuning}/>
    </div>
}