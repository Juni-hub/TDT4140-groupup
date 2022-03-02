import React, {useState, useEffect} from "react";
import { Router, useRouter } from 'next/router'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Progress} from "reactstrap";
import { NextURL } from "next/dist/server/web/next-url";
import UserGroupList from "./UserGroupList";

const UserProfile = () => {
    const router = useRouter();

    const [userData, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)

// Checking typof to only check localstorage on client-side (does not exist on server)
// Because Next.js will render parts of website server-side
if(typeof window !== "undefined"){
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem('Token')
        },
    }
}

    const getUserData = () => {
        fetch(`http://localhost:8000/profile/`, requestOptions)
          .then((res) => res.json())
          .then((userData) => {
            setData(userData)
            setLoading(false)
          })
    }

    useEffect(() => {
        setLoading(true)
        getUserData();
      }, [])

      if (isLoading) return <><p>Loading...</p><Progress animated color="info" value={100} /></>
      if (!userData) return <p style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>No profile data</p>
      if (userData.user == null) {
          router.push('/loginPage')
        return <p style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>You are not logged in</p>
        }
      else {
     return (
        <div>
            <div class="container-fluid">

                <div class="row extra-margin mt-5">
                    <div class="col-md-4" style={{ minWidth: "340px"}}>

                        <div class="text-center">
                            <img src="https://cdn3.vectorstock.com/i/1000x1000/08/67/person-gray-photo-placeholder-man-vector-23190867.jpg" height={"300px"} alt="Profile Picture" />
                            <ul class="list-unstyled mb-4 text-left">
                                <li class="mb-3 mt-3">{userData.user.username}</li>
                                <li class="mb-3">{userData.user.email}</li>
                            </ul>
                        </div>
                    </div>

                   <UserGroupList></UserGroupList>

                </div>
            </div>
        </div>
  )
}
}
export default UserProfile;