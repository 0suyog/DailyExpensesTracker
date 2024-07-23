import styles from "./register.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
export function Register() {
    const userNameRef = useRef();
    const passwordRef = useRef();
    const [showPwd, setShowPwd] = useState(false);
    const navigate = useNavigate();
    function register() {
        const userName = userNameRef.current.value;
        let password = passwordRef.current.value;
        fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName: userName,
                password: password,
            }),
        }).then((response) => {
            if (response.ok) {
                navigate("/login");
            } else if (response.status == 409) {
                alert("Username already in use Try another one");
            }
        });
    }
    return (
        <>
            <div className={styles.container}>
                <h1 class={styles.loginTitle}>Register</h1>
                <form
                    className={styles.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        register();
                    }}>
                    <div className={styles.textInput}>
                        <fieldset className={styles.userNameFieldSet}>
                            <legend>User:</legend>
                            <input
                                type="text"
                                className={styles.userName}
                                autofocus
                                ref={userNameRef}
                                required
                            />
                        </fieldset>
                        <fieldset className={styles.passwordFieldSet}>
                            <legend>Password:</legend>
                            <input
                                type="password"
                                className={styles.password}
                                ref={passwordRef}
                                required
                            />
                            <span
                                className={styles.icon}
                                onMouseEnter={() => setShowPwd(true)}
                                onMouseLeave={() => setShowPwd(false)}>
                                <FontAwesomeIcon
                                    icon={showPwd ? faEye : faEyeSlash}
                                    className={styles.icon}></FontAwesomeIcon>
                            </span>
                        </fieldset>
                    </div>
                    <button type="submit" className={styles.submit}>
                        Sign Up
                    </button>
                    <p class="redirectToRegiser">
                        Already an user? <Link to={"/login"}>Login</Link>
                    </p>
                </form>
            </div>
            {/* <div className={styles.overlay}>
                <form
                    className={styles.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        login();
                    }}>
                    <span>Register Here</span>
                    <div className={styles.inputSection}>
                        <label htmlFor="userName">Item Name: </label>
                        <input
                            type="text"
                            id="userName"
                            className={styles.textInput}
                            ref={userNameRef}
                        />
                    </div>
                    <div className={styles.inputSection}>
                        <label htmlFor="password">Item Name: </label>
                        <input
                            type="password"
                            id="password"
                            className={styles.textInput}
                            ref={passwordRef}
                        />
                    </div>
                    <span
                        className={styles.closeButton}
                        onClick={() => {
                            // context.setShowInput(false);
                        }}>
                        <FontAwesomeIcon icon={faClose} />
                    </span>
                    <button type="submit" className={styles.submit}>
                        Register
                    </button>
                    <span>
                        Already a User?
                        <Link to={"/login"}>Click here to Login</Link>
                    </span>
                </form>
            </div> */}
        </>
    );
}
