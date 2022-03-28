import React, {useState, useEffect} from "react";
import { useRouter } from 'next/router'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner, Card, CardBody, CardTitle, CardText, CardImg, CardSubtitle, Row, Container, Button} from "reactstrap";
import { NextURL } from "next/dist/server/web/next-url";
import { faHeart, faStar, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
             return <FontAwesomeIcon icon={faHeart} style={{color: "#DF4B5F"}} />
         }
         else{
             //Icon - This group has not liked the other group
             return <FontAwesomeIcon icon={faHeart} onClick={() => likeHandle(groupID, thisGroupData.id)} style={{color: "#4D4D4D"}} />
         }
    }

    //If group is superliked button changes color and likeHandle function is called
    function getSuperlikeButton(groupID){
        if (!thisGroupData.is_gold) {
            return null;
        }
        else if(thisGroupData.super_liked_groups.includes(groupID)){
            //Icon - This group superlikes the other group
            return <Button style={{border: "none", backgroundColor: "white"}}><FontAwesomeIcon icon={faStar} style={{color: "#01b6cb"}} /></Button>
        }
        else{
            //Icon - This group has not liked the other group
            return <Button style={{border: "none", backgroundColor: "white"}}><FontAwesomeIcon icon={faStar} onClick={() => superlikeHandle(groupID, thisGroupData.id)} style={{color: "#4D4D4D"}} /></Button>
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
          <h5 style = {{fontWeight: "700"}}> Finn nye grupper</h5>
          <Row md="4" sm="3" xs="1">
            {[...groupData]
              .filter((group) => (props.filterFunction ? props.filterFunction(group) : true))
              .map((group, i) => (
                <>
                  <Card style={{ backgroundColor: "#fffff", border: "", borderRadius: "10px", margin: "10px", minWidth: "260px"}}>
                    <CardImg alt="Card image cap" src={getImage(group.image)} top width="150px" onClick={() => goToGroup(group.id)} />
                    <CardBody>
                      <CardTitle tag="h5">{group.name}</CardTitle>
                      <CardSubtitle className="mb-2 mt-2 text-muted" tag="h6">
                        <FontAwesomeIcon icon={faUserGroup} style={{color: "#696969"}}></FontAwesomeIcon>
                        {' '}
                        {group.expanded_members.length} medlemmer
                      </CardSubtitle>
                      <CardText>{group.description}</CardText>
                      <Button style={{border: "none", backgroundColor: "white"}}>
                        {getLikeButton(group.id)}
                      </Button>
                        {getSuperlikeButton(group.id)}
                      
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
