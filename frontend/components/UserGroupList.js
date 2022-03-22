import React, {useState, useEffect} from "react";
import { useRouter } from 'next/router'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Progress, Card, CardBody, CardTitle, CardText, CardImg, CardSubtitle, Row} from "reactstrap";
import { NextURL } from "next/dist/server/web/next-url";
import styles from "../styles/Home.module.css";

const UserGroupList = () => {


    const [groupData, setGroupData] = useState(null)
    const [isLoading, setLoading] = useState(false)

    const router = useRouter()

    function getImage(url){
        if (url != null){
            return "http://localhost:8000" + url;
        }
        return "https://as2.ftcdn.net/v2/jpg/04/70/29/97/1000_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg";
    }

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

    const getGroupData = () => {
        fetch(`http://localhost:8000/group/`, requestOptions)
          .then((res) => res.json())
          .then((groupData) => {
            setGroupData(groupData)
            console.log(groupData)
            setLoading(false)
          })
    }

    const goToGroup = (id) =>{
        router.push("groupPage/"+id)
    }

    useEffect(() => {
        setLoading(true)
        getGroupData();
      }, [])


      if (isLoading) return <><p>Loading...</p><Progress animated color="info" value={100} /></>
      if (!groupData) return <p><h5>Ingen data</h5></p>
      if (!groupData[0]) return <div style={{width:"100%", display:"flex", justifyContent:"center"}}><p style={{margin:"40px"}}>Ingen Grupper</p></div>


  return (
        <div style={{width:"100%", padding:"2%", paddingTop:"0%", boxSizing:"content-box", display:"flex", flexWrap:"wrap"}}>
            
            {[...groupData].map((group, i) =>(
            <>
            <Card className={styles.groupCard} style={{padding:"0px", margin: "10px", minWidth:"200px", maxWidth:"250px", boxShadow:"0 2px 4px 0 rgba(100, 100, 100, 0.26)"}} onClick={()=>goToGroup(group.id)}>
                <CardImg
                    alt="Card image cap"
                    src= {getImage(group.image)}
                    width="inherit" 
                    style={{display:"block", aspectRatio:"5/4", objectFit:"cover"}}/>
                <CardBody>
                    <CardTitle tag="h5">
                    {group.name}
                    </CardTitle>
                    <CardSubtitle
                        className="mb-2 text-muted"
                        tag="h6"
                    >
                        {group.expanded_members.length} medlemmer
                    </CardSubtitle>
                    <CardText>
                        Gruppebesktivelse
                    </CardText>
                </CardBody>
            </Card>
            </>
        ))}
        </div>
  )
}

export default UserGroupList