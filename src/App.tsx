import {Staff} from "./components/Staff/Staff.tsx";
import {Fretboard, type FretboardState} from "./components/Fretboard/Fretboard.tsx";
import {nameToPitchClass, type PitchClass, type StaffIdx} from "./utils/notes.ts";
import type {StaffLineState} from "./components/StaffLine/StaffLine.tsx";
import {useState} from "react";
import {type FretboardString, FretboardVisualization} from "./lib/FretboardVisualization.ts";
import styles from "./App.module.css"

const GUITAR_TUNING = [
    nameToPitchClass("E3"),
    nameToPitchClass("A3"),
    nameToPitchClass("D4"),
    nameToPitchClass("G4"),
    nameToPitchClass("H4"),
    nameToPitchClass("E5"),
]

const FRET_COUNT = 12

export function App() {
    const [fretboardState, setFretboardState] = useState<FretboardState>({
        stringsCount: 6,
        fretCount: FRET_COUNT,
        dots: new Map(),
        stringsHighlights: new Map(),
    })

    function onStaffChange(staffState: Map<StaffIdx, StaffLineState>) {
        let highlightedNotes: PitchClass[] = []

        for (const [_, state] of staffState) {
            if (state.showNote) {
                highlightedNotes.push(state.naturalPitchClass + state.modifier as PitchClass)
            }
        }

        const newState = new FretboardVisualization(GUITAR_TUNING as FretboardString[], FRET_COUNT)
            .noteDots(highlightedNotes)
            .stringHighlight(highlightedNotes)
            .toFretboardState()

        setFretboardState(newState)
    }

    return <div className={styles.main}>
        <Staff startStaffIdx={-13 as StaffIdx} endStaffIdx={9 as StaffIdx} isOutOfBounds={(idx: StaffIdx) => idx > 4 || idx < -6} onStaffChange={onStaffChange}/>
        <Fretboard initialWidth={120} height={230} fretboardState={fretboardState}/>
    </div>
}