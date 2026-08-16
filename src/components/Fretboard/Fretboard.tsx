import styles from "./Fretboard.module.css"
import {Fragment, useMemo} from "react";
import type {FretIdx, StringIdx} from "../../lib/FretboardVisualization.ts";

type DotProps = {
    stringIdx: StringIdx;
    color: string;
}

export type FretboardState = {
    stringsCount: number;
    fretCount: number;
    dots: Map<FretIdx, DotProps[]>
}

type FretProps = {
    width: number;
    fret: FretIdx;
    state: FretboardState;
}

function showFretboardMarker(fretIdx: FretIdx) {
    if (fretIdx % 12 == 0) return true;
    if ((fretIdx + 1) % 12 == 0 || (fretIdx - 1) % 12 == 0) return false;

    return (fretIdx + 1) % 2 == 0
}

function Fret({width, fret, state}: FretProps) {
    const height = 100;
    const dotsToShow: Map<StringIdx, DotProps> = useMemo(() => {
        const stringToDot: Map<StringIdx, DotProps> = new Map()

        for (const fretDot of state.dots.get(fret) ?? []) {
            stringToDot.set(fretDot.stringIdx, fretDot)
        }

        return stringToDot
    }, [state])

    function getStringYOffset(stringIdx: StringIdx) {
        return height / (state.stringsCount) * stringIdx + height / (state.stringsCount * 2)
    }

    return <svg width={width} height={height} className={styles.fretContainer}>
        <rect width="1"
              height={height}
              fill="black"
        />

        {[...Array(state.stringsCount)].map((_, stringIdx) =>
            <Fragment key={stringIdx}>
                <rect width={width}
                      height="1"
                      y={getStringYOffset(stringIdx as StringIdx)}
                />
                {dotsToShow.get(stringIdx as StringIdx) &&
                    <circle cx={width / 2} r={3.5} cy={getStringYOffset(stringIdx as StringIdx)}
                            fill={dotsToShow.get(stringIdx as StringIdx)!.color}/>
                }
            </Fragment>
        )}

        <text x={width / 2} y={height + 12} textAnchor="middle" fontSize={10} fill="gray">{fret}</text>
        {showFretboardMarker(fret) && <circle cx={width / 2} r={2} cy={height + 17} fill="black"/>}
    </svg>
}

type FretboardProps = {
    initialWidth: number;
    fretboardState: FretboardState;
}

export function Fretboard({initialWidth, fretboardState}: FretboardProps) {
    return <div className={styles.fretboardContainer}>
        {[...Array(fretboardState.fretCount)].map((_, fretIdx) =>
            <Fret
                key={fretIdx}
                width={initialWidth * Math.pow(0.5, (fretIdx + 1) / 12)}
                fret={fretIdx + 1 as FretIdx}
                state={fretboardState}
            />
        )}
    </div>
}