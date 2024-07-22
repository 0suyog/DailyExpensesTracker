import styles from "./ExpenseForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { formContext } from "./App";
import { useContext, useEffect, useRef, useState } from "react";
import { insertData } from "./Data";
import { useAsyncError } from "react-router-dom";
export function ExpenseForm() {
    const context = useContext(formContext);
    const itemsRef = useRef(null);
    const quantityRef = useRef(null);
    const priceRef = useRef(null);
    const paidRef = useRef(null);
    const partialPriceRef = useRef(null);
    const unpaidRef = useRef();

    const [paidStatus, setPaidStatus] = useState(false);
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [itemPrice, setItemPrice] = useState(0);
    const [ownPrice, setOwnPrice] = useState(0);
    const [changeAll, setChangeAll] = useState(false);
    const [partiallyPaid, setPartiallyPaid] = useState(false);
    const [partiallyPaidPrice, setPartiallyPaidPrice] = useState(0);
    const [expenseFormClass, setExpenseFormClass] = useState(styles.expenseForm);
    useEffect(() => {
        requestItems();
        if (itemsRef.current.value) {
            setItemPrice(items[itemsRef.current.value].price);
            setItemName(items[itemsRef.current.value]._id);
        }
        context.setNewItem(false);
    }, [context.newItem]);

    useEffect(() => {
        if (items.length > 0) {
            setItemPrice(items[0].price);
            setTotalPrice(quantity * itemPrice);
            setItemName(items[0]._id);
        }
        console.log(items);
    }, [items]);
    useEffect(() => {
        if (partiallyPaid) {
            setExpenseFormClass(styles.expenseFormBigger);
        } else {
            setExpenseFormClass(styles.expenseForm);
        }
    }, [partiallyPaid]);
    function requestItems() {
        fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/items`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: sessionStorage.getItem("id"),
            }),
        }).then(async (response) => {
            if (response.ok) {
                const allItems = await response.json();
                console.log(allItems);
                setItems(allItems);
            }
        });
    }

    function handleChange() {
        setPartiallyPaid(false);
        setPartiallyPaidPrice(0);
        if (paidRef.current.checked) {
            setPaidStatus(paidRef.current.value);
        } else if (unpaidRef.current.checked) {
            setPaidStatus(unpaidRef.current.value);
        }
    }
    function itemNameChange(e) {
        setItemPrice(items[itemsRef.current.value].price);
        setItemName(items[itemsRef.current.value]._id);
    }
    useEffect(() => {
        setTotalPrice(quantity * itemPrice);
        priceRef.current.value = itemPrice;
    }, [itemPrice, quantity]);

    async function handleSubmit(e) {
        e.preventDefault();
        alert(paidStatus);
        const response = await fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/expense`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                itemName: itemName,
                itemPrice: itemPrice,
                date: new Date().getTime(),
                paidStatus: paidStatus,
                ownPrice: itemPrice,
                quantity: quantity,
                changeAll: changeAll,
                partiallyPaidPrice: partiallyPaid ? Number(partialPriceRef.current.value) : 0,
                user: sessionStorage.getItem("id"),
            }),
        });
        if (response.ok) {
            const data = await response.json();
            // context.setShowInput(false);
            context.setUpdatedForm(true);
        }
    }
    return (
        <>
            <form className={expenseFormClass} onSubmit={handleSubmit}>
                <select
                    name=""
                    id=""
                    className={styles.ItemName}
                    onChange={itemNameChange}
                    required
                    ref={itemsRef}>
                    {items.map((item, index) => {
                        return (
                            <option value={index} key={item._id} className={styles.options}>
                                {item.item}
                            </option>
                        );
                    })}
                </select>
                <fieldset
                    className={styles.quantityFieldSet}
                    onClick={() => {
                        quantityRef.current.focus();
                    }}>
                    <legend>Quantity: </legend>
                    <input
                        type="number"
                        id="quantity"
                        className={styles.editableInput}
                        min={1}
                        defaultValue={1}
                        required
                        ref={quantityRef}
                        onChange={(e) => {
                            setQuantity(e.target.value);
                        }}
                    />
                </fieldset>
                <fieldset
                    className={styles.expensePriceFieldSet}
                    onClick={() => {
                        priceRef.current.focus();
                    }}>
                    <legend>Price:</legend>
                    <input
                        type="number"
                        className={styles.editableInput}
                        ref={priceRef}
                        onChange={(e) => {
                            if (e.target.value != items[itemName]) {
                                setItemPrice(e.target.value);
                                setOwnPrice(e.target.value);
                            } else {
                                setItemPrice(0);
                                setOwnPrice(0);
                            }
                        }}
                    />
                </fieldset>

                <div className={styles.radiosAndChecks}>
                    <label htmlFor="updatePrice">
                        <input
                            type="checkBox"
                            id="updatePrice"
                            className={styles.checkBox}
                            onChange={(e) => {
                                setChangeAll(e.target.checked);
                            }}
                        />
                        Update Price of Item forever?
                    </label>
                    <label>
                        Paid Status:
                        <label className={styles.paidStatus}>
                            <input
                                type="radio"
                                name="paidStatus"
                                id="paid"
                                value={true}
                                ref={paidRef}
                                onChange={handleChange}
                            />
                            Paid
                        </label>
                        <label className={styles.paidStatus}>
                            <input
                                type="radio"
                                name="paidStatus"
                                id="unpaid"
                                value={false}
                                defaultChecked={true}
                                ref={unpaidRef}
                                onChange={handleChange}
                            />
                            Unpaid
                        </label>
                        <label className={styles.paidStatus}>
                            <input
                                type="radio"
                                name="paidStatus"
                                id="partiallyPaid"
                                value={false}
                                // ref={parti}
                                onChange={(e) => {
                                    setPartiallyPaid(true);
                                    setPaidStatus(false);
                                }}
                            />
                            Partially Paid
                        </label>
                    </label>
                </div>
                {partiallyPaid == true ? (
                    <fieldset
                        className={styles.PaidPriceFieldSet}
                        onClick={() => {
                            partialPriceRef.current.focus();
                        }}>
                        <legend>PaidPrice:</legend>
                        <input
                            type="number"
                            className={styles.editableInput}
                            defaultValue={0}
                            min={0}
                            max={totalPrice}
                            ref={partialPriceRef}
                            onChange={(e) => {
                                if (e.target.value < totalPrice) {
                                    setPartiallyPaidPrice(e.target.value);
                                }
                            }}
                        />
                    </fieldset>
                ) : null}
                <div>
                    <span>{`Total Expense: Rs.${totalPrice} `}</span>
                    <span>{`Due:${totalPrice - partiallyPaidPrice}`}</span>
                </div>
                <button type="submit" className={styles.submit}>
                    Add Expense
                </button>
            </form>
        </>
    );
}
