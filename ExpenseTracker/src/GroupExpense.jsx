import { useContext, useEffect, useRef, useState } from "react";
import styles from "./GroupExpense.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faMultiply } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { formContext } from "./App";
import { IndividualExpense } from "./IndividualExpense";
export function GroupExpense(props) {
    const context = useContext(formContext);
    const [expense, setExpense] = useState(props.expense);
    const [expenses, setExpenses] = useState([]);
    const [paid, setPaid] = useState(props.expense.paid);
    const [expensePrice, setExpensePrice] = useState(0);
    const [checked, setChecked] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [updatedExpense, setUpdatedExpense] = useState(false);
    const checkRef = useRef(null);
    useEffect(() => {
        context.setAllExpenses((expenses) => {
            if (expenses.some((item) => item.label === expense.item)) {
                return expenses;
            }

            return [
                ...expenses,
                {
                    label: expense.item,
                    value: expense.total,
                },
            ];
        });
        setExpensePrice(() => {
            if (expense.ownPrice > 0) {
                return expense.quantity * expense.ownPrice - expense.partiallyPaid;
            } else {
                return expense.item.price * expense.quantity - expense.partiallyPaid;
            }
        });
    }, [expense]);
    useEffect(() => {
        setExpense(props.expense);
    }, [props.expense]);
    useEffect(() => {
        if (showDetails) {
            fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/expenses`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    itemId: expense._id,
                    userId: context.storage.getItem("id"),
                }),
            }).then(async (response) => {
                const result = await response.json();
                if (response.ok) {
                    setExpenses(result);

                    setUpdatedExpense(false);
                } else {
                    alert(result);
                }
            });
        }
    }, [showDetails, updatedExpense, context.updatedForm]);
    useEffect(() => {
        {
            context.setTotalExpense((total) => total + expense.total);
            if (!paid) {
                console.log(expense.price);
                context.setTotalUnpaid((total) => total + expense.due);
            }
        }
    }, []);

    useEffect(() => {
        if (context.deleteExpenses) {
            deleteExpense();
        }
        context.setDeleteExpenses(false);
    }, [context.deleteExpenses]);

    useEffect(() => {
        console.log(expenses);
    }, [expenses]);

    // useEffect(() => {}, [edit]);

    function changeStatus(toStatus) {
        fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/updateStatus`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                itemId: expense._id,
                userId: context.storage.getItem("id"),
                status: toStatus,
            }),
        }).then((res) => {
            if (res.ok) {
                setPaid(toStatus);
                if (toStatus) {
                    context.setTotalUnpaid((t) => t - expense.due);
                    context.setUpdatedForm(true);
                    setUpdatedExpense(true);
                } else {
                    context.setUpdatedForm(true);
                    setUpdatedExpense(true);
                    context.setTotalUnpaid((t) => t + expense.due);
                }
            }
        });
    }
    function deleteExpense() {
        fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/deleteAllExpenseOfOneType`, {
            method: "Post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                itemId: expense._id,
                userId: context.storage.getItem("id"),
            }),
        }).then((res) => {
            if (res.ok) {
                context.setUpdatedForm(true);
                context.setTotalExpense((e) => e - expense.due);
                const index = context.allExpenses.findIndex(
                    (item) => item.label === expense.item.item
                );
                context.allExpenses.splice(index, 1);
                if (!paid) {
                    context.setTotalUnpaid((e) => e - expense.due);
                }
            }
        });
    }

    return (
        <div className={styles.container}>
            <div
                className={styles.expense}
                onClick={() => {
                    setShowDetails(!showDetails);
                }}>
                <div className={styles.expenseLeftContainer}>
                    <span className={styles.itemName}>{`Item: ${expense.item}`}</span>
                    <br />
                <span className={styles.itemPrice}>{`Due: Rs. ${expense.due}`}</span>
                </div>
                <div className={styles.expenseButtons}>
                    {expense.due > 0 ? (
                        <>
                            <FontAwesomeIcon
                                icon={faMultiply}
                                className={`${styles.icon} ${styles.cross}`}
                            />
                            <button
                                className={styles.unPayExpense}
                                onClick={(e) => {
                                    changeStatus(true);
                                    e.stopPropagation();
                                }}>
                                Paid
                            </button>
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon
                                icon={faCheck}
                                className={`${styles.icon} ${styles.check}`}
                            />
                            <button
                                className={styles.payExpense}
                                onClick={(e) => {
                                    changeStatus(false);
                                    e.stopPropagation();
                                }}>
                                Paid
                            </button>
                        </>
                    )}
                    <button
                        className={styles.delete}
                        onClick={(e) => {
                            deleteExpense();
                            e.stopPropagation();
                        }}>
                        <FontAwesomeIcon
                            icon={faTrashCan}
                            className={`${styles.icon} ${styles.trash}`}
                        />
                    </button>
                </div>
            </div>
            {showDetails ? (
                <div className={styles.detailContainer}>
                    {expenses.map((e, index) => {
                        return (
                            <>
                                <IndividualExpense
                                    expense={e}
                                    setUpdatedExpense={setUpdatedExpense}
                                />
                            </>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}
