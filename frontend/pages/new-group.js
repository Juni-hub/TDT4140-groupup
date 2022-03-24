import CreateGroupForm from "../components/createGroupForm";
import RegisterGroupForm from "../components/registerGroupForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from '../components/navBar';

export default function NewGroup() {
  return (
    <div>
      <NavigationBar />
      <RegisterGroupForm />
    </div>
  )
}
