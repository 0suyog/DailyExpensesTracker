import { createContext, useEffect, useState } from "react";
import styles from "./App.module.css";
import { GroupExpense } from "./GroupExpense";
import { TImeFrame } from "./TimeFrame";
import { Dateselection } from "./DateSelection";
import { SelectionBar } from "./SelectionBar";
import { BodyContainer } from "./BodyContainer";
import { ExpenseForm } from "./ExpenseForm";
import { Login } from "./login";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Register } from "./register";
import { Options } from "./options";
import { ItemForm } from "./itemForm";
export const formContext = createContext();
function App() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState();
    const [showInput, setShowInput] = useState(false);
    const [updatedForm, setUpdatedForm] = useState(false);
    const [uid, setUid] = useState(null);
    const [totalExpense, setTotalExpense] = useState(0);
    const [totalUnpaid, setTotalUnpaid] = useState(0);
    const [allExpenses, setAllExpenses] = useState([]);
    const [checkAll, setCheckAll] = useState(false);
    const [showItemForm, setShowItemForm] = useState(false);
    const [deleteExpenses, setDeleteExpenses] = useState(false);
    const [payAll, setPayAll] = useState(false);
    const [unpayAll, setUnpayAll] = useState(false);
    const [newItem, setNewItem] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [storage, setStorage] = useState(sessionStorage);
    useEffect(() => {
        setUid(storage.getItem("id"));
        if (localStorage.getItem("loggedIn")) {
            setUid(localStorage.getItem("id"));
        }
        setStorage(localStorage);
    }, []);
    // ! uncomment this its important
    useEffect(() => {
        if (uid == null) {
            navigate("/login");
        } else {
            navigate("/");
        }
    }, [uid]);
    useEffect(() => {
        console.log(allExpenses);
    }, [allExpenses]);
    return (
        <>
            <canvas className={styles.canvas}></canvas>
            <formContext.Provider
                value={{
                    formData: formData,
                    setShowInput: setShowInput,
                    showInput: showInput,
                    setUpdatedForm: setUpdatedForm,
                    updatedForm: updatedForm,
                    setUid: setUid,
                    totalExpense: totalExpense,
                    setTotalExpense: setTotalExpense,
                    totalUnpaid: totalUnpaid,
                    setTotalUnpaid: setTotalUnpaid,
                    allExpenses: allExpenses,
                    setAllExpenses: setAllExpenses,
                    checkAll: checkAll,
                    setCheckAll: setCheckAll,
                    showItemForm: showItemForm,
                    setShowItemForm: setShowItemForm,
                    showItemForm: showItemForm,
                    deleteExpenses: deleteExpenses,
                    setDeleteExpenses: setDeleteExpenses,
                    payAll: payAll,
                    setPayAll: setPayAll,
                    unpayAll: unpayAll,
                    setUnpayAll: setUnpayAll,
                    newItem: newItem,
                    setNewItem: setNewItem,
                    showDelete: showDelete,
                    setShowDelete: setShowDelete,
                    storage: storage,
                    setStorage: setStorage,
                }}>
                <Routes>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/register" element={<Register />}></Route>
                    <Route
                        path="/"
                        element={
                            <>
                                {/* {showInput ? <ExpenseForm /> : null} */}
                                {/* {showItemForm ? <ItemForm /> : null} */}

                                <BodyContainer />
                            </>
                        }></Route>
                    <Route path="/test" element={<Login />}></Route>
                </Routes>
            </formContext.Provider>
        </>
    );
}

export default App;
