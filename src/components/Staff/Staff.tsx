import styles from "./Staff.module.css"
import {MouseContextProvider} from "../../contexts/MousePositionContext.tsx";
import {StaffLine, type StaffLineState} from "../StaffLine/StaffLine.tsx";
import type {StaffIdx} from "../../utils/notes.ts";
import {useRef} from "react";


type StaffProps = {
    startStaffIdx: StaffIdx;
    endStaffIdx: StaffIdx;
    onStaffChange: (states: Map<StaffIdx, StaffLineState>) => void;
}

export function Staff({startStaffIdx, endStaffIdx, onStaffChange}: StaffProps) {
    const staffState = useRef(new Map<StaffIdx, StaffLineState>())

    const handleOnChange = (staffIdx: StaffIdx) => function (state: StaffLineState) {
        staffState.current.set(staffIdx, state)
        onStaffChange(staffState.current)
    }

    return (<div className={styles.staffContainer}>
        <MouseContextProvider>
            {[...Array(endStaffIdx - startStaffIdx)].map((_, i) => (
                <StaffLine key={i}
                           line={i % 2 != 0}
                           staffIdx={(endStaffIdx - i) as StaffIdx}
                           onChange={handleOnChange((startStaffIdx - i) as StaffIdx)}/>))}
        </MouseContextProvider>
    </div>)
}