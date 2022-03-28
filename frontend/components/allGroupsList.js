import React, {useState, useEffect} from "react";
import { useRouter } from 'next/router'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner, Card, CardBody, CardTitle, CardText, CardImg, CardSubtitle, Row, Container, Button} from "reactstrap";
import { NextURL } from "next/dist/server/web/next-url";
import { faHeart, faStar, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from "../styles/Home.module.css";

const AllGroupsList = (props) => {

  const [thisGroupData, setThisGroupData] = useState(null)
  const [groupData, setGroupData] = useState(null);

  const router = useRouter();
  const originalId = router.query["id"];

  function getImage(url) {
    if (url != null) {
      return "http://localhost:8000" + url;
    }
    return "https://as2.ftcdn.net/v2/jpg/04/70/29/97/1000_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg";
  }

    //If group is liked button changes color and likeHandle function is called
    function getLikeButton(groupID){
         if(thisGroupData.liked_groups.includes(groupID)){
             //Icon - This group likes the other group
             return <FontAwesomeIcon icon={faHeart} style={{color: "#DF4B5F", fontSize:"30px"}} />
         }
         else{
             //Icon - This group has not liked the other group
             return <FontAwesomeIcon icon={faHeart} onClick={() => likeHandle(groupID, thisGroupData.id)} style={{color: "#4D4D4D", fontSize:"30px"}} />
         }
    }

    //If group is superliked button changes color and likeHandle function is called
    function getSuperlikeButton(groupID){
        if (!thisGroupData.is_gold) {
            return null;
        }
        else if(thisGroupData.super_liked_groups.includes(groupID)){
            //Icon - This group superlikes the other group
            return <Button style={{border: "none", backgroundColor: "rgba(0,0,0,0)"}}><FontAwesomeIcon icon={faStar} style={{color: "#01b6cb", fontSize:"30px"}} /></Button>
        }
        else{
            //Icon - This group has not liked the other group
            return <Button style={{border: "none", backgroundColor: "rgba(0,0,0,0)"}}><FontAwesomeIcon icon={faStar} onClick={() => superlikeHandle(groupID, thisGroupData.id)} style={{color: "#4D4D4D",fontSize:"30px"}} /></Button>
        }
   }

    function likeHandle(groupID, thisGroup) {
        if(typeof window !== "undefined"){
            const postRequestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("Token"),
            },
            body: JSON.stringify({
                liked_group_id: groupID,
            }),
            };
            fetch(`http://localhost:8000/like/${thisGroup}/`, postRequestOptions).then((res) => res.json())
            .then((thisGroupData) => {
                setThisGroupData(thisGroupData);
              });;
        }
    }

    function superlikeHandle(groupID, thisGroup) {
        if(typeof window !== "undefined"){
            const postRequestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("Token"),
            },
            body: JSON.stringify({
                super_liked_group_id: groupID,
            }),
            };
            fetch(`http://localhost:8000/superlike/${thisGroup}/`, postRequestOptions).then((res) => res.json())
            .then((thisGroupData) => {
                setThisGroupData(thisGroupData);
              });;
        }
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
  

    const getGroupData = (id) => {
        fetch(`http://localhost:8000/all_groups/` + id, requestOptions)
          .then((res) => res.json())
          .then((groupData) => {
            setGroupData(groupData)
          })
    }

    const getThisGroup = (id) => {
        fetch(`http://localhost:8000/group/` + id + "/", requestOptions)
          .then((res) => res.json())
          .then((thisGroupData) => {
            setThisGroupData(thisGroupData)
          })
      };

    const goToGroup = (id) =>{
        router.push("../../group-page/" + originalId + "/other-group/"+id)
    }

    useEffect(() => {
        const groupId = typeof window !== "undefined" ? localStorage.getItem("group") : null;
        getThisGroup(groupId);
        getGroupData(groupId);
      }, [])

return !(groupData && thisGroupData) ? (
        <Spinner></Spinner>
      ) : (
    <div>
      <Container fluid>
        <div class="" style = {{margin: "10px", paddingTop: "10px"}}>
          <Row md="4" sm="3" xs="1">
            {[...groupData]
              .filter((group) => (props.filterFunction ? props.filterFunction(group) : true))
              .map((group, i) => (
                <>
                  <Card className={styles.groupCard} 
                  style={{border: "", borderRadius: "10px", minWidth: "220px", padding:"0px", margin: "10px", boxShadow:"0 2px 4px 0 rgba(100, 100, 100, 0.26)"}}
                  onClick={() => goToGroup(group.id)}>
                    <CardImg alt="Card image cap" src={getImage(group.image)} style={{display:"block", aspectRatio:"5/4", objectFit:"cover"}} />
                    <CardBody style={{position:"relative"}}>
                      <CardTitle tag="h5">{group.name}</CardTitle>
                      <CardSubtitle className="mb-2 mt-2 text-muted" tag="h6">
                        <FontAwesomeIcon icon={faUserGroup} style={{color: "#696969"}}></FontAwesomeIcon>
                        {' '}
                        {group.expanded_members.length} medlemmer
                      </CardSubtitle>
                      <CardText>{group.description}</CardText>
                      <div style={{height:"20px"}}>
                      </div>
                      <div style= {{right:"10px",bottom:"5px", position:"absolute", minHeight:"min-content"}}>
                        <Button style={{border: "none", backgroundColor:"rgba(0,0,0,0)"}}>
                          {getLikeButton(group.id)}
                        </Button>
                          {getSuperlikeButton(group.id)}
                      </div>
                      
                    </CardBody>
                  </Card>
                </>
              ))}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default AllGroupsList;
