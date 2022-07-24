import axios from "axios";
import { useState } from "react";

// this is used to make request in a react componenet
// this hook returns a function do Request and errors
// errors is empty unless there is an errors where u
// go to the catch statement and the errors become
// the html defined inside setErrors
export default ({url, method, body, onSuccess})=>{
    const [ errors, setErrors] =  useState(null);
    
 // takes props and merge with body
    const doRequest = async (props = {} ) =>{
        try{
          setErrors(null);
          const response = await axios[method](url, 
            {...body, ...props}
            );
          
          if (onSuccess){
            onSuccess(response.data)
          }
          return response.data;
        }catch (err){
            setErrors(<div className = "alert alert-danger">
            <h4>Ooops...</h4>
            <ul className="my-0">
            {err.response.data.errors.map((err) => 
            <li key={err.message}> {err.message}</li>
            )} 
            </ul>
        </div>);
        }
    };
    return {doRequest, errors};

}
