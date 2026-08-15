import styles from "./Staff.module.css"
import {MouseContextProvider} from "../../contexts/MousePositionContext.tsx";
import {StaffLine} from "../StaffLine/StaffLine.tsx";
import type {StaffIdx} from "../../utils/notes.ts";


type StaffProps = {
    startStaffIdx: StaffIdx; endStaffIdx: StaffIdx;
}

export function Staff({startStaffIdx, endStaffIdx}: StaffProps) {
    return (<div className={styles.staffContainer}>
        <MouseContextProvider>
            {[...Array(endStaffIdx - startStaffIdx)].map((_, i) => (
                <StaffLine line={i % 2 != 0} staffIdx={(endStaffIdx - i) as StaffIdx} key={i}/>))}
        </MouseContextProvider>
    </div>)
}