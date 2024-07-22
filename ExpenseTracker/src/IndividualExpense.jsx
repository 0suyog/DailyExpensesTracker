import { useContext, useEffect, useState } from "react";
import styles from "./IndividualExpense.module.css";
import { formContext } from "./App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faMultiply, faTrashCan, faCheck } from "@fortawesome/free-solid-svg-icons";
export function IndividualExpense(props) {
    const [expense, setExpenses] = useState(props.expense);
    const context = useContext(formContext);
    function getFullDate(expenseDate) {
        let dateObject = new Date(expenseDate);
        let month = dateObject.getMonth() + 1;
        let date = dateObject.getDate();
        let day = dateObject.getDay() + 1;
        let year = dateObject.getFullYear();
        const dayMap = { 1: "Sun", 2: "Mon", 3: "Tue", 4: "Wed", 5: "Thu", 6: "Fri", 7: "Sat" };
        return `${year}/${month}/${date} ${dayMap[day]}`;
    }

    function deleteIndividualExpense() {
        fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/deleteIndividualExpense`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: expense._id,
            }),
        }).then(async (response) => {
            if (response.ok) {
                props.setUpdatedExpense(true);
                context.setUpdatedForm(true);
            } else {
                alert("faied to delete Expense");
            }
        });
    }

    function payIndividualExpense(status) {
        fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/updateStatusOfIndividualExpense`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: expense._id,
                status: status,
                totalPrice: expense.ownPrice * expense.quantity,
            }),
        }).then((response) => {
            if (response.ok) {
                props.setUpdatedExpense(true);
                context.setUpdatedForm(true);
            }
        });
    }

    useEffect(() => {
        setExpenses(props.expense);
    }, [props.expense]);
    return (
        <div className={styles.container} key={expense._id}>
            <div className={styles.details}>
                <span>{`Date: ${getFullDate(expense.date)}`}</span>
                <span>{`Total: ${expense.ownPrice * expense.quantity}`}</span>
                <span>{`Paid Price: ${expense.partiallyPaid}`}</span>
            </div>
            <div>
                {expense.partiallyPaid == expense.ownPrice * expense.quantity ? (
                    <>
                        <FontAwesomeIcon
                            icon={faCheck}
                            className={`${styles.icon} ${styles.check}`}
                        />
                        <button
                            className={styles.payExpense}
                            onClick={() => {
                                payIndividualExpense(!expense.paid);
                            }}>
                            Paid
                        </button>
                    </>
                ) : (
                    <>
                        <FontAwesomeIcon
                            icon={faMultiply}
                            className={`${styles.icon} ${styles.cross}`}
                        />
                        <button
                            className={styles.unPayExpense}
                            onClick={() => {
                                payIndividualExpense(!expense.paid);
                            }}>
                            Paid
                        </button>
                    </>
                )}

                <button className={styles.delete} onClick={deleteIndividualExpense}>
                    <FontAwesomeIcon
                        icon={faTrashCan}
                        className={`${styles.icon} ${styles.trash}`}
                    />
                </button>
            </div>
        </div>
    );
}
