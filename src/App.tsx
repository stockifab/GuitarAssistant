import {Staff} from "./components/Staff/Staff.tsx";
import {Fretboard} from "./components/Fretboard/Fretboard.tsx";
import {nameToPitchClass} from "./utils/notes.ts";

export function App() {
    return <>
        <Staff startStaffIdx={-7} endStaffIdx={4}/>
        <Fretboard initialWidth={60}
                   stringPitchClasses={[
                       nameToPitchClass("E3"),
                       nameToPitchClass("A3"),
                       nameToPitchClass("D4"),
                       nameToPitchClass("G4"),
                       nameToPitchClass("H4"),
                       nameToPitchClass("E5"),
                   ]}
                   highlightedPitchClasses={[nameToPitchClass("A4"), nameToPitchClass("C5")]}/>
    </>
}