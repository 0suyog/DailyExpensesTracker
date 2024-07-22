import { Dateselection } from "./DateSelection";
import styles from "./SelectionBar.module.css";
import { ExpenseForm } from "./ExpenseForm";
import { formContext } from "./App";
import { useContext } from "react";
export function SelectionBar(props) {
    const context = useContext(formContext);
    function addItem() {
        context.setShowItemForm(true);
    }
    return (
        // <div className={styles.selectionBar}>
        //     <div className={styles.titleAndButton}>
        //         <h2 className={styles.title}>Expenses</h2>
        //         <button
        //             className={styles.addExpenseButton}
        //             onClick={() => {
        //                 context.setShowInput(true);
        //             }}>
        //             Add Expense
        //         </button>
        //         <button onClick={addItem}>add item</button>
        //     </div>
        //     <Dateselection />
        // </div>
        <div className={styles.topBar}>
            <h2 className={styles.topBarTitle}>Expenses</h2>
            <div className={styles.dates}>
                <label>
                    Time Period:
                    <select className={styles.timePeriod}>
                        <option value="Monthly">Monthly</option>
                        <option value="Daily">Daily</option>
                    </select>
                </label>
                <label>
                    Date:
                    <input type="date" className={styles.dateInput} />
                </label>
            </div>
        </div>
    );
}
