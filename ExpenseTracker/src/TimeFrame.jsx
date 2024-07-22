import styles from "./App.module.css";
export function TImeFrame(props) {
    return (
        <div className={styles.timeFrame}>
            <label htmlFor="selectType">Time frame: </label>
            <select name="timeFrame" id="selectType" defaultValue={"Monthly"}>
                <option value="Daily">Daily</option>
                <option value="Monthly">Monthly</option>
            </select>
        </div>
    );
}