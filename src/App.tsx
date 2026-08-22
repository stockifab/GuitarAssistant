import {Staff} from "./components/Staff/Staff.tsx";
import {Fretboard, type FretboardState} from "./components/Fretboard/Fretboard.tsx";
import {nameToPitchClass, type PitchClass, pitchClassToStaffIdx, type StaffIdx} from "./utils/notes.ts";
import type {StaffLineState} from "./components/StaffLine/StaffLine.tsx";
import {useEffect, useMemo, useState} from "react";
import {type FretboardString, FretboardVisualization} from "./lib/FretboardVisualization.ts";
import styles from "./App.module.css"

const GUITAR_TUNING = [
    nameToPitchClass("D3"),
    nameToPitchClass("A3"),
    nameToPitchClass("D4"),
    nameToPitchClass("G4"),
    nameToPitchClass("H4"),
    nameToPitchClass("E5"),
]

const FRET_COUNT = 12

export function App() {
    const [staffState, setStaffState] = useState(new Map<StaffIdx, StaffLineState>())
    const [activeNotes, setActiveNotes] = useState<PitchClass[]>([])
    const [tuning, setTuning] = useState<PitchClass[]>(GUITAR_TUNING)
    const [fretboardState, setFretboardState] = useState<FretboardState>({
        stringsCount: 6,
        fretCount: FRET_COUNT,
        dots: new Map(),
        stringsHighlights: new Map(),
    })

    useEffect(() => {
        let highlightedNotes: PitchClass[] = []

        for (const [_, state] of staffState) {
            if (state.showNote) {
                highlightedNotes.push(state.naturalPitchClass + state.modifier as PitchClass)
            }
        }

        setActiveNotes(highlightedNotes)
    }, [staffState]);

    useEffect(() => {
        const newState = new FretboardVisualization(tuning as FretboardString[], FRET_COUNT)
            .noteDots(activeNotes)
            .stringHighlight(activeNotes)
            .toFretboardState()

        setFretboardState(newState)
    }, [activeNotes, tuning]);

    const {startStaffIdx, endStaffIdx} = useMemo(() => {
        return {
            startStaffIdx: pitchClassToStaffIdx(Math.min(...tuning) - 1 as PitchClass),
            endStaffIdx: pitchClassToStaffIdx(Math.max(...tuning) + fretboardState.fretCount as PitchClass),
        }
    }, [tuning, fretboardState])

    return <div className={styles.main}>
        <Staff startStaffIdx={startStaffIdx}
               endStaffIdx={endStaffIdx}
               isOutOfBounds={(idx: StaffIdx) => idx > 4 || idx < -6}
               staffState={staffState}
               setStaffState={setStaffState}/>
        <Fretboard initialWidth={120}
                   height={230}
                   fretboardState={fretboardState}
                   tuning={tuning}
                   setTuning={setTuning}/>
    </div>
}