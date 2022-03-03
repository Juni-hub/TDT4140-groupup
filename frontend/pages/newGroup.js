import CreateGroupForm from "../components/createGroupForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from '../components/navBar';

export default function NewGroup() {
  return (
    <div>
      <NavigationBar/>
      <CreateGroupForm/>
    </div>
  )
}