
import styles from '../styles/Home.module.css';
import RegisterUserForm  from '../components/registerUserForm';

const RegisterUser = () => {
  return (
    <div className={styles.registerPage} style={{backgroundColor: "#f0f2f5"}}>
      <RegisterUserForm />
    </div>
  )
}

export default RegisterUser;