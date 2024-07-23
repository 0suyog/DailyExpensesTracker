import { useContext, useRef } from "react";
import styles from "./itemForm.module.css";
import { formContext } from "./App";
export function ItemForm() {
    const inpRef = useRef();
    const priceRef = useRef();
    const context = useContext(formContext);
    function handleSubmit(e) {
        e.preventDefault();
        fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/item`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                item: inpRef.current.value,
                price: priceRef.current.value,
                user: context.storage.getItem("id"),
            }),
        }).then((response) => {
            if (response.ok) {
                alert("itemAdded");
                context.setNewItem(true);
            }
            // status 409 for item already exists
            else if (response.status == 409) {
                alert("item already exists");
            }
        });
    }
    return (
        <>
            <form className={styles.itemForm} onSubmit={handleSubmit}>
                <fieldset
                    className={styles.itemNameFieldSet}
                    onClick={() => {
                        inpRef.current.focus();
                    }}>
                    <legend>ItemName:</legend>
                    <input type="text" className={styles.editableInput} autofocus ref={inpRef} />
                </fieldset>

                <fieldset
                    className={styles.itemPriceFieldSet}
                    onClick={() => {
                        priceRef.current.focus();
                    }}>
                    <legend>Price:</legend>
                    <input type="number" className={styles.editableInput} ref={priceRef} />
                </fieldset>
                <button type="submit" className={styles.submit}>
                    Add Item
                </button>
            </form>
        </>
    );
}
