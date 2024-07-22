import { useContext, useEffect, useRef, useState } from "react";
import styles from "./DeleteItemForm.module.css";
import { formContext } from "./App";
export function DeleteForm() {
    const context = useContext(formContext);
    const [items, setItems] = useState([]);
    const [toDeleteItem, setToDeleteItem] = useState(items[0]);
    const itemsRef = useRef(null);
    useEffect(() => {
        requestItems();
        if (itemsRef.current != null) {
            setToDeleteItem(items[itemsRef.current.value]);
        }
    }, [context.newItem]);
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
                setItems(allItems);

                // alert(allItems)
            }
        });
    }
    function handleSubmit() {
        fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/deleteItem`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: toDeleteItem,
            }),
        }).then(async () => {
            if (response.ok) {
                context.setNewItem(true);
            }
        });
    }
    return (
        <>
            <form className={styles.deleteForm} onSubmit={handleSubmit}>
                <select
                    name=""
                    id=""
                    className={styles.ItemName}
                    ref={itemsRef}
                    onChange={(e) => {
                        setToDeleteItem(e.target.value);
                    }}>
                    {items.map((item, index) => {
                        return (
                            <option value={index} key={item._id} className={styles.options}>
                                {item.item}
                            </option>
                        );
                    })}
                </select>
                <button type="submit" className={styles.submit}>
                    Add Expense
                </button>
            </form>
        </>
    );
}
