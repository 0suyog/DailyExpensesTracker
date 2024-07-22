import styles from "./login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useContext, useRef } from "react";
import { formContext } from "./App";
import { useNavigate, Link } from "react-router-dom";
import process from "process";
export function Login() {
    const navigate = useNavigate();
    const context = useContext(formContext);
    const userNameRef = useRef();
    const passwordRef = useRef();
    function login() {
        // alert(${import.meta.env.VITE_SERVER_ADDRESS});
        const userName = userNameRef.current.value;
        const password = passwordRef.current.value;
        fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName: userName,
                password: password,
            }),
        }).then(async (response) => {
            if (response.status == 401) {
                alert("Wrong Password");
            } else {
                const userId = await response.json();
                context.setUid(userId);
                sessionStorage.setItem("id", userId);
                navigate("/");
            }
        });
    }
    return (
        <>
            <div className={styles.container}>
                <h1 class={styles.loginTitle}>Log in</h1>
                <form
                    className={styles.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        login();
                    }}>
                    <div className={styles.textInput}>
                        <fieldset className={styles.userNameFieldSet}>
                            <legend>User:</legend>
                            <input
                                type="text"
                                className={styles.userName}
                                autoFocus
                                ref={userNameRef}
                            />
                        </fieldset>
                        <fieldset className={styles.passwordFieldSet}>
                            <legend>Password:</legend>
                            <input type="password" className={styles.password} ref={passwordRef} />
                        </fieldset>
                    </div>
                    <div className={styles.keepAndforget}>
                        <label for="keeplogin">
                            <input type="checkBox" id="keeplogin" className={styles.checkBox} />{" "}
                            Keep me looged in
                        </label>
                        {/* <a href="/" className={styles.forgotPwd}>
                            Forgotten Your Password?
                        </a> */}
                    </div>
                    <button type="submit" className={styles.submit}>
                        Sign In
                    </button>
                    <p class="redirectToRegiser">
                        Not registered yet? <Link to={"/register"}>Register</Link>
                    </p>
                </form>
            </div>
        </>
    );
}
