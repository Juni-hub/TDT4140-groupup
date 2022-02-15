import React from "react";
import styles from "../styles/Home.module.css"



const  RegisterUserForm = () => {
    return(
        <div className={styles.registerContainer}>
            <h2>REGISTER NEW USER</h2>

            <form action="submit" className={styles.registerForm}>
                <label className={styles.registerField}> First name: 
                    <input className={styles.registerInput} type="text" name="firstName"/>
                </label>

                <label className={styles.registerField}> Last name: 
                    <input className={styles.registerInput} type="text" name="lastName" />
                </label>

                <label className={styles.registerField}> User name:  
                    <input className={styles.registerInput} type="text" name="userName" />
                </label>

                <label className={styles.registerField}> Age:  
                    <input className={styles.registerInput} type="number" name="userName" />
                </label>

                <label className={styles.registerField}> Password:  
                    <input className={styles.registerInput} type="password" name="userName" />
                </label>

                <button className={styles.registerButton} type="submit"> REGISTER</button>
            </form>
        </div>
    )
}

export default RegisterUserForm;