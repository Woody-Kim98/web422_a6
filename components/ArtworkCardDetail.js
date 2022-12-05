import useSWR from "swr";
import Error from "next/error"
//import Link from "next/link";
import { Button, Card } from "react-bootstrap";
import { useAtom } from "jotai";
import { favouritesAtom } from "../store"
import { useEffect, useState } from "react";
import { addToFavourites, removeFromFavourites } from "../lib/UserData";

export default  function ArtworkCardDetail({objectID})
{
    const { data, error } = useSWR( objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null)

    const [ favouritesList, setFavouritesList ] = useAtom(favouritesAtom);
    const [ showAdded, setShowAdded ] = useState(favouritesList.includes(objectID));

    useEffect(()=>{
        setShowAdded(favouritesList?.includes(objectID))
       }, [favouritesList])


    console.log(objectID + "included:" + showAdded)

    async function favouritesClicked()
    {
        if(showAdded == true)
        {
            setFavouritesList(await removeFromFavourites(objectID)) 
            setShowAdded(false)
           
        }
        else if(showAdded == false)
        { 
            setFavouritesList(await addToFavourites(objectID))
            setShowAdded(true)
        }
    }



    if(error)
    {
        console.log(error)
        return(
            <Error statusCode={404} />  
        )
    }
    else if(data != null && data != undefined)
    {
       console.log(showAdded);
        return(
                  <Card>
                  <Card.Img variant="top" src={data?.primaryImage} />
                  <Card.Body>
                    <Card.Title>{data.title ? data.title : 'N/A'}</Card.Title>
                    <Card.Text>
                        <strong>Date: </strong>{data.objectDate ? data.objectDate : "N/A"}<br />
                        <strong>Classification: </strong>{data.classification ? data.classification : "N/A"}<br />
                        <strong>Medium: </strong>{data.medium ? data.medium : "N/A"}<br />
                        <br />
                        <strong>Artist: </strong>{data.artistDisplayName ? data.artistDisplayName : "N/A"}
                        &nbsp;{data.artistWikidata_URL ? <a href={data?.artistWikidata_URL} target="_blank" rel="noreferrer">( wiki )</a> : "" } 
                        <br />
                        
                        <strong>Credit Line: </strong>{data.creditLine ? data.creditLine : "N/A"}<br />
                        <strong>Dimensions: </strong>{data.dimensions ? data.dimensions : "N/A"} 

                       
                    </Card.Text>
                    
                    <Button variant={showAdded ? "primary" : "outline-primary"} onClick={favouritesClicked}>{ showAdded ? "+ Favourite (added)" : "+ Favourite"}</Button>

                  </Card.Body>
                </Card>  
            
        )
    }
    else{
        return null;
    }

}