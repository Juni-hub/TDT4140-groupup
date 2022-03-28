import 'bootstrap/dist/css/bootstrap.min.css';

import { Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle, Progress, Row } from "reactstrap";
import React, {useEffect, useState} from "react";

import { NextURL } from "next/dist/server/web/next-url";
import { useRouter } from 'next/router'

const groupMatchesList = () => {

    const [groupData, setGroupData] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const router = useRouter();
    const id = router.query["otherId"];
    const originalId = router.query["id"];

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
        fetch(`http://localhost:8000/matches/` + originalId + "/", requestOptions)
          .then((res) => res.json())
          .then((groupData) => {
            setGroupData(groupData)
            setLoading(false)
          })
    }

    const goToGroup = (id) =>{
        router.push("../../group-page/" + originalId + "/matched-groups/"+id)
    }

    useEffect(() => {
        setLoading(true)
        if(originalId)
        getGroupData();
      }, [originalId])


      if (isLoading) return <><p>Loading...</p><Progress animated color="info" value={100} /></>
      if (!groupData) return <p><h5>Ingen data</h5></p>
      if (!groupData[0]) return <p>Ingen grupper</p>


  return (
    <div class="col-md-8">                
    <Row
        md="4"
        sm="3"
        xs="1"
    >
    {[...groupData].map((group, i) =>(
           <>
        <Card style={{margin: "10px", minWidth: "300px" }} onClick={()=>goToGroup(group.id)}>
            <CardImg
                alt="Card image cap"
                src= {getImage(group.image)}
                top
                width="150px" />
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
                    {group.description}
                </CardText>
            </CardBody>
        </Card>
        </>
    ))}
    </Row>
</div>
  )
}

export default groupMatchesList