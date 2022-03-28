import RegisterGroupForm from "../components/registerGroupForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from '../components/navBar';

export default function NewGroup() {
  return (
    <div style={{backgroundColor: "#f0f2f5"}}>
      <NavigationBar />
      <RegisterGroupForm />
    </div>
  )
}
