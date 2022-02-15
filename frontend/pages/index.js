import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import LoginForm from '../components/loginForm';

export default function Home() {
  return (
    <div className={styles.loginPage}>
      <LoginForm />
    </div>
  )
}
