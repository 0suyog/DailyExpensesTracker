import styles from "./App.module.css";
import { TImeFrame } from "./TimeFrame";
export function Dateselection(props) {
    return (
        <div className={styles.dateSelection}>
            <TImeFrame />
            <div className={styles.date}>
                <label htmlFor="date">Date:</label>
                <input type="date" name="date" id="date" defaultValue={new Date()} />
            </div>
        </div>
    );
}
