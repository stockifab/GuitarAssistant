import styles from "./Staff.module.css"
import {MouseContextProvider} from "../../contexts/MousePositionContext.tsx";
import {StaffLine, type StaffLineState} from "../StaffLine/StaffLine.tsx";
import type {StaffIdx} from "../../utils/notes.ts";
import {useRef} from "react";


type StaffProps = {
    startStaffIdx: StaffIdx;
    endStaffIdx: StaffIdx;
    onStaffChange: (states: Map<StaffIdx, StaffLineState>) => void;
    isOutOfBounds: (idx: StaffIdx) => boolean;
}

export function Staff({startStaffIdx, endStaffIdx, onStaffChange, isOutOfBounds}: StaffProps) {
    const staffState = useRef(new Map<StaffIdx, StaffLineState>())

    const handleOnChange = (staffIdx: StaffIdx) => function (state: StaffLineState) {
        staffState.current.set(staffIdx, state)
        onStaffChange(staffState.current)
    }

    return (
        <div>
            <div className={styles.staffContainer}>
                <MouseContextProvider>
                    {[...Array(Math.abs(startStaffIdx - endStaffIdx))].map((_, i) => (
                        <StaffLine key={i}
                                   line={(endStaffIdx - i) % 2 != 0}
                                   staffIdx={(endStaffIdx - i) as StaffIdx}
                                   onChange={handleOnChange((endStaffIdx - i) as StaffIdx)}
                                   outOfBounds={isOutOfBounds(endStaffIdx - i as StaffIdx)}
                        />
                    ))}
                </MouseContextProvider>
            </div>
        </div>
    )
}