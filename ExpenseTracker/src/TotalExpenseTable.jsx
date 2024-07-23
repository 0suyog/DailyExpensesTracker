import { useContext, useEffect, useState } from "react";
import styles from "./TotalExpenseTable.module.css";
import { formContext } from "./App";
export function TotalExpenseTable() {
    const context = useContext(formContext);
    const [totals, setTotals] = useState([]);
    useEffect(() => {
        fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/totalExpenseOfItems`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: context.storage.getItem("id") }),
        }).then(async (response) => {
            const result = await response.json();
            if (response.ok) {
                setTotals(result);
            }
        });
    }, [context.updatedForm]);
    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.row}>
                        <th className={styles.head}>Item</th>
                        <th className={styles.head}>Total Expense</th>
                    </tr>
                </thead>
                <tbody>
                    {totals.map((total) => (
                        <tr key={total._id} className={styles.row}>
                            <td className={styles.data}>
                                <span>{total.item}</span>
                            </td>
                            <td className={styles.data}>
                                <span>{total.total}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
