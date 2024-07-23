import { useContext, useEffect, useRef, useState } from "react";
import { formContext } from "./App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import styles from "./options.module.css";
export function Options() {
    const context = useContext(formContext);
    function payAll() {
        fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/payAllExpenses`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: context.storage.getItem("id"),
            }),
        }).then((response) => {
            if (response.ok) {
                context.setUpdatedForm(true);
            } else {
                alert("failed to pay all");
            }
        });
    }
    function unPayAll() {
        fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/unPayAllExpenses`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: context.storage.getItem("id"),
            }),
        }).then((response) => {
            if (response.ok) {
                context.setUpdatedForm(true);
            } else {
                alert("failed to pay all");
            }
        });
    }
    function deleteAll() {
        fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/deleteAllExpenses`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: context.storage.getItem("id"),
            }),
        }).then((response) => {
            if (response.ok) {
                context.setUpdatedForm(true);
            } else {
                alert("failed to pay all");
            }
        });
    }

    return (
        <div className={styles.optionsBar}>
            <div className={styles.optionBarButtons}>
                <button className={`${styles.payButton} ${styles.optionButton}`} onClick={payAll}>
                    PayAll
                </button>
                <button
                    className={`${styles.unPayButton} ${styles.optionButton}`}
                    onClick={unPayAll}>
                    Unpay All
                </button>
                <button
                    className={`${styles.deleteButton} ${styles.optionButton}`}
                    onClick={deleteAll}>
                    DeleteAll
                </button>
            </div>
        </div>
    );
}
