import React from "react";
import styles from "../styles/Home.module.css"


const LoginForm = () => {
    return (
        <div className={styles.loginContainer}>
            <form className={styles.loginForm}> 

                <label className={styles.field}>
                    UserName:
                    <input className={styles.textField} type="text" name="username" />
                </label>
                
                <label className={styles.field}>
                    Password:
                    <input className={styles.textField} type="text" name="password" />
                </label>
                <button className={styles.button} type="submit">Logg in</button>
            </form>
            <div>
                <p>If you don't already have a user?</p>
                <button className={styles.button} type ="button"> Register new user</button>
            </div>
        </div>
    )
}

export default LoginForm;
