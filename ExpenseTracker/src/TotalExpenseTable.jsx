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
            body: JSON.stringify({ userId: sessionStorage.getItem("id") }),
        }).then(async (response) => {
            const result = await response.json();
            if (response.ok) {
                setTotals(result);
            }
        });
    }, [context.updatedForm]);
    return (
        <>
            <table>
                <tr className={styles.tableHeading}>
                    <th>Item</th>
                    <th>Total Expense</th>
                </tr>
                <tbody>
                    {totals.map((total) => (
                        <tr key={total._id} className={styles.tableHeading}>
                            <td>{total.item}</td>
                            <td>{total.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
