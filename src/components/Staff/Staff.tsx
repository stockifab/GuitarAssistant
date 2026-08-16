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
                    {[...Array(endStaffIdx - startStaffIdx)].map((_, i) => (
                        <StaffLine key={i}
                                   line={i % 2 == 0} // TODO: The truthiness of this line depends on start and end staff indices, notes may appear on incorrect lines
                                   staffIdx={(endStaffIdx - i) as StaffIdx}
                                   onChange={handleOnChange((endStaffIdx - i) as StaffIdx)}
                                   outOfBounds={isOutOfBounds(endStaffIdx - i as StaffIdx)}
                        />))}
                </MouseContextProvider>
            </div>
        </div>
    )
}