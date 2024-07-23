import styles from "./ExpenseContainer.module.css";
import { GroupExpense } from "./GroupExpense";
import Expenses from "./Data";
import { useContext, useEffect, useState } from "react";
import { formContext } from "./App";
import { useNavigate } from "react-router-dom";

export function ExpenseContainer(props) {
    const navigate = useNavigate();
    const context = useContext(formContext);
    const [expenses, setExpenses] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/initialData`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: context.storage.getItem("id"),
                    }),
                });
                if (response.ok) {
                    const responseData = await response.json();
                    setExpenses(responseData);
                    context.setUpdatedForm(false);
                } else {
                    context.setUpdatedForm(false);
                    setExpenses([]);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [context.updatedForm]);
    return (
        <div className={styles.expenseContainer}>
            {expenses.map((expense, index) => {
                return <GroupExpense expense={expense} key={expense._id} />;
            })}
        </div>
    );
}
