import styles from "./Fretboard.module.css"
import {Fragment} from "react";

type FretProps = {
    width: number;
    pitchClassOffset: number;
    strings: number[];
    highlightedPitchClasses: number[]
}

function Fret({width, strings, pitchClassOffset, highlightedPitchClasses}: FretProps) {
    const height = 100;

    function getStringYOffset(stringIdx: number) {
        return height / (strings.length) * stringIdx + height / (strings.length * 2)
    }

    function getStringPitchClass(stringIdx: number) {
        return strings[stringIdx] + pitchClassOffset
    }

    return <svg width={width} height={height}>
        <rect width="1"
              height={height}
              fill="black"
        />

        {[...Array(strings.length)].map((_, i) =>
            <Fragment key={i}>
                <rect width={width}
                      height="1"
                      y={getStringYOffset(i)}
                />
                {highlightedPitchClasses.includes(getStringPitchClass(i)) &&
                    <circle cx={width / 2 - 1.75} r={3.5} cy={getStringYOffset(i)} fill="black"/>
                }
            </Fragment>
        )}
    </svg>
}

type FretboardProps = {
    initialWidth: number;
    stringPitchClasses: number[];
    highlightedPitchClasses: number[];
}

export function Fretboard({initialWidth, stringPitchClasses, highlightedPitchClasses}: FretboardProps) {
    return <div className={styles.fretboardContainer}>
        {[...Array(12)].map((_, i) =>
            <Fret
                key={i}
                width={initialWidth * Math.pow(0.5, (i + 1) / 12)}
                strings={stringPitchClasses}
                pitchClassOffset={i + 1}
                highlightedPitchClasses={highlightedPitchClasses}
            />
        )}
    </div>
}