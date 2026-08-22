import styles from "./Fretboard.module.css"
import type {FretIdx, StringIdx} from "../../lib/FretboardVisualization.ts";
import {Fret} from "../Fret/Fret.tsx";
import {FretStringTuner} from "../FretStringTuner/FretStringTuner.tsx";
import type {PitchClass} from "../../utils/notes.ts";

export type DotProps = {
    stringIdx: StringIdx;
    color: string;
}

export type FretboardState = {
    stringsCount: number;
    fretCount: number;
    dots: Map<FretIdx, DotProps[]>
    stringsHighlights: Map<StringIdx, { color: string }>
}

type FretboardProps = {
    initialWidth: number;
    height: number;
    fretboardState: FretboardState;
    tuning: PitchClass[];
    setTuning: (tuning: PitchClass[]) => void;
}

export function Fretboard({initialWidth, height, fretboardState, tuning, setTuning}: FretboardProps) {
    return <div className={styles.fretboardContainer}>
        <FretStringTuner height={height} state={fretboardState} tuning={tuning} setTuning={setTuning} />
        <div className={styles.fretboardFretContainer}>
            {[...Array(fretboardState.fretCount)].map((_, fretIdx) =>
                <Fret
                    key={fretIdx}
                    width={initialWidth * Math.pow(0.5, (fretIdx + 1) / 12)}
                    height={height}
                    fret={fretIdx + 1 as FretIdx}
                    state={fretboardState}
                />
            )}
        </div>
    </div>
}