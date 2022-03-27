import React, {useState, useEffect} from "react";
import { Router, useRouter } from 'next/router'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Progress, Container, Card, CardHeader, CardBody, CardImg, CardFooter} from "reactstrap";
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
          router.push('/login')
        return <p style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>You are not logged in</p>
        }
      else {
     return (

        <div style={{padding:"30px"}}>
            <Container className="d-flex h-100" style={{display: "flex", marginTop:"0%"}}>
                <Card style={{marginRight:"15px", minWidth:"300px", minHeight:"100%", maxWidth:"400px"}}>
                    <CardImg src="brukerbilde.jpeg" style={{aspectRatio:"1", objectFit:"cover"}}/>
                    <CardBody>
                        <h5 class="card-title">{userData.user.username}</h5>
                        <p>{userData.user.email}</p>

                    </CardBody>
                    <CardFooter style={{height:"30px"}}/>
                </Card>
                <Card style={{minWidth:"500px"}}>
                    <CardHeader style={{backgroundColor: "#ABD08D", fontSize:"22px"}}>
                        {userData.user.username}s Grupper
                    </CardHeader>
                    <CardBody>
                        <UserGroupList></UserGroupList>
                    </CardBody>
                </Card>
            </Container>
        </div>
  )
}
}

export default UserProfile;