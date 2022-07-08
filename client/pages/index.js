import buildClient from "../api/build-client";

// this will be run in our browser
// response.data is passed to this function 
// {currentUser} is extracted from reponse.data ie
// instead of doing response.data.currentUser u can just
// do {currentUser}
const LandingPage = ({currentUser}) =>{
    return currentUser ? (
    <h1> You are signed in </h1>
    ) : (
    <h1> You are not signed in</h1>
    );
};

// this is executed during the server side rendering after rendering we will rely 
//on the components
//during the server side rendering we need to make check if user is signed in 
// we will do that in the  getInitialProps
// useRequest can  only be used in react component and during the server side rendering
// we can't fetch data from react component

// this is run on the server
LandingPage.getInitialProps = async (context) =>{
    const client = buildClient(context);
    const response = await client.get('/api/users/currentuser');
    // response.data --> { currentUser: null } if user is not signed in 
    //response.data -->{currentUser: { email:"asasa", id: "aadsdsd"}} if user is signed in
    return response.data;   
}


export default LandingPage;