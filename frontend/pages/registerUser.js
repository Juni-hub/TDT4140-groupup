
import styles from '../styles/Home.module.css';
import RegisterUserForm  from '../components/registerUserForm';

const RegisterUser = () => {
  return (
    <div className={styles.registerPage}>
      <RegisterUserForm />
    </div>
  )
}

export default RegisterUser;