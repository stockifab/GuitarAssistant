import type {FretIdx, StringIdx} from "../../lib/FretboardVisualization.ts";
import type {DotProps, FretboardState} from "../Fretboard/Fretboard.tsx";
import {Fragment, useMemo} from "react";
import styles from "./Fret.module.css";

export type FretProps = {
    height: number;
    width: number;
    fret: FretIdx;
    state: FretboardState;
}

function showFretboardMarker(fretIdx: FretIdx) {
    if (fretIdx % 12 == 0) return true;
    if ((fretIdx + 1) % 12 == 0 || (fretIdx - 1) % 12 == 0) return false;

    return (fretIdx + 1) % 2 == 0
}

export function Fret({height, width, fret, state}: FretProps) {
    const fontSize = height / 10

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

    function getStringColor(stringIdx: StringIdx) {
        return state.stringsHighlights.get(stringIdx)?.color ?? "black"
    }

    function isStringHighlighted(stringIdx: StringIdx) {
        return state.stringsHighlights.get(stringIdx) !== undefined
    }

    return <svg width={width} height={height} className={styles.fretContainer}>
        <rect width="1"
              height={height}
              fill="black"
        />

        {[...Array(state.stringsCount)].map((_, stringIdx) =>
            <Fragment key={stringIdx}>
                <rect width={width}
                      height={isStringHighlighted(stringIdx as StringIdx) ? 6 : 1}
                      fill={getStringColor(stringIdx as StringIdx)}
                      y={getStringYOffset(stringIdx as StringIdx) - (isStringHighlighted(stringIdx as StringIdx) ? 3 : 0)}
                />
                {dotsToShow.get(stringIdx as StringIdx) &&
                    <circle cx={width / 2} r={fontSize / 3} cy={getStringYOffset(stringIdx as StringIdx)}
                            fill={dotsToShow.get(stringIdx as StringIdx)!.color}/>
                }
            </Fragment>
        )}

        <text x={width / 2} y={height + fontSize + fontSize / 5} textAnchor="middle" fontSize={fontSize}
              fill="gray">{fret}</text>
        {showFretboardMarker(fret) && <circle cx={width / 2} r={fontSize / 5} cy={height + fontSize * 2} fill="gray"/>}
    </svg>
}
