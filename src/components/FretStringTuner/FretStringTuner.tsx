import type {StringIdx} from "../../lib/FretboardVisualization.ts";
import styles from "./FretStringTuner.module.css";
import type {FretboardState} from "../Fretboard/Fretboard.tsx";
import {nameToPitchClass, type PitchClass, pitchClassToName} from "../../utils/notes.ts";
import {useState} from "react";

type FretProps = {
    height: number;
    state: FretboardState;
    tuning: PitchClass[];
    setTuning: (tuning: PitchClass[]) => void;
}

export function FretStringTuner({height, state, tuning, setTuning}: FretProps) {
    const [tuningInput, setTuningInput] = useState<string[]>(tuning.map(pitchClassToName))


    function getStringYOffset(stringIdx: StringIdx) {
        return height / (state.stringsCount) * stringIdx + height / (state.stringsCount * 2)
    }

    const onStringTuningChange = (stringIdx: StringIdx) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTuningInput = [...tuningInput]
        newTuningInput[stringIdx] = e.target.value
        setTuningInput(newTuningInput)
        if (nameToPitchClass(e.target.value)) {
            const newTuning = [...tuning]
            newTuning[stringIdx] = nameToPitchClass(e.target.value)!
            setTuning(newTuning)
        }
    }

    const onStringTuningBlur = (stringIdx: StringIdx) => (e: React.FocusEvent<HTMLInputElement>) => {
        if (!nameToPitchClass(e.target.value)) {
            const newTuningInput = [...tuningInput]
            newTuningInput[stringIdx] = pitchClassToName(tuning[stringIdx])
            setTuningInput(newTuningInput)
        }
    }

    return <div style={{
        height: height
    }} className={styles.fretStringTunerContainer}>
        {[...Array(state.stringsCount)].map((_, stringIdx) =>
            <div key={stringIdx}
                 className={styles.fretStringTuner}
                 style={{
                     top: getStringYOffset(stringIdx as StringIdx),
                 }}
            >
                <input value={tuningInput[stringIdx]} onChange={onStringTuningChange(stringIdx as StringIdx)}
                       onBlur={onStringTuningBlur(stringIdx as StringIdx)}/>
            </div>
        )}
    </div>
}
