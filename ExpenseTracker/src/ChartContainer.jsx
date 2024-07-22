import { ExpenseContainer } from "./ExpenseContainer";
import styles from "./App.module.css";
import { formContext } from "./App";
import { useContext } from "react";

function ChartContainer(props) {
    const context = useContext(formContext);
    return (
        <div className={styles.bodyContainer}>
            <ExpenseContainer />
            <div className={styles.chartContainer}>This is where Charteshwor maharaj live</div>
            
        </div>
    );
}
