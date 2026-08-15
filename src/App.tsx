import {Staff} from "./components/Staff/Staff.tsx";
import {Fretboard} from "./components/Fretboard/Fretboard.tsx";
import {nameToPitchClass, type PitchClass, type StaffIdx} from "./utils/notes.ts";
import type {StaffLineState} from "./components/StaffLine/StaffLine.tsx";
import {useState} from "react";

export function App() {
    const [highlightedNotes, setHighlightedNotes] = useState<PitchClass[]>([])

    function onStaffChange(staffState: Map<StaffIdx, StaffLineState>) {
        let newHighlightedNotes: PitchClass[] = []

        for (const [_, state] of staffState) {
            if (state.showNote) {
                newHighlightedNotes.push(state.naturalPitchClass + state.modifier as PitchClass)
            }
        }

        setHighlightedNotes(newHighlightedNotes)
    }

    return <>
        <Staff startStaffIdx={-7 as StaffIdx} endStaffIdx={4 as StaffIdx} onStaffChange={onStaffChange}/>
        <Fretboard initialWidth={60}
                   stringPitchClasses={[
                       nameToPitchClass("E3"),
                       nameToPitchClass("A3"),
                       nameToPitchClass("D4"),
                       nameToPitchClass("G4"),
                       nameToPitchClass("H4"),
                       nameToPitchClass("E5"),
                   ]}
                   highlightedPitchClasses={highlightedNotes}/>
    </>
}