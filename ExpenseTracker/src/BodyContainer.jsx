import { ExpenseContainer } from "./ExpenseContainer";
import styles from "./BodyContainer.module.css";
import { formContext } from "./App";
import { useContext, useEffect, useState } from "react";
import { SelectionBar } from "./SelectionBar";
import { Options } from "./options";
import { ExpenseForm } from "./ExpenseForm";
import { ItemForm } from "./itemForm";
import PieChartForExpenses from "./PieChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinimize, faMinus } from "@fortawesome/free-solid-svg-icons";
import { DeleteForm } from "./DeleteItemForm";
import { TotalExpenseTable } from "./TotalExpenseTable";
import { Link, useNavigate } from "react-router-dom";

export function BodyContainer(props) {
    const navigate = useNavigate();
    const [totalExpense, setTotalExpense] = useState(0);
    const [totalUnpaid, setTotalUnpaid] = useState(0);
    const context = useContext(formContext);
    useEffect(() => {
        fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/totalExpense`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: context.storage.getItem("id"),
            }),
        }).then(async (response) => {
            if (response.ok) {
                const result = await response.json();
                setTotalExpense(result.total);
                setTotalUnpaid(result.due);
            } else if (response.status == 404) {
                setTotalExpense(0);
                setTotalUnpaid(0);
            } else {
                alert("some error occured");
            }
        });
    }, [context.updatedForm]);
    return (
        <>
            <div className={styles.leftContainer}>
                {/* <SelectionBar /> */}
                <Options />
                <ExpenseContainer />
            </div>
            <div className={styles.middleContainer}>
                <div className={styles.dropDown}>
                    <span>Add Expense</span>
                    <button
                        onClick={() => {
                            context.setShowInput((currentValue) => !currentValue);
                        }}>
                        <FontAwesomeIcon
                            icon={context.showInput ? faMinus : faPlus}
                            className={styles.icon}
                        />
                    </button>
                </div>
                {context.showInput ? <ExpenseForm /> : null}
                <div className={styles.dropDown}>
                    <span>Add Item</span>
                    <button
                        onClick={() => {
                            context.setShowItemForm((currentValue) => !currentValue);
                        }}>
                        <FontAwesomeIcon
                            icon={context.showItemForm ? faMinus : faPlus}
                            className={styles.icon}
                        />
                    </button>
                </div>
                {context.showItemForm ? <ItemForm /> : null}
            </div>
            <div className={styles.rightContainer}>
                <div className={styles.PieAndLogout}>
                    <PieChartForExpenses />
                    <div className={styles.TotalAndLogOut}>
                        <div className={styles.total}>
                            <span>{`Total Expense: ${totalExpense}`}</span>
                            <span>{`Total Unpaid: ${totalUnpaid}`}</span>
                        </div>
                        <button
                            className={styles.logOut}
                            onClick={() => {
                                navigate("/login");
                                context.storage.clear();
                            }}>
                            Logout
                        </button>
                    </div>
                </div>
                <TotalExpenseTable />
            </div>
        </>
    );
}
