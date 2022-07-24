import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';
// Next takes ur component ie each page
// and wrap it up in its custom default component called app
// here we have defined our own custom component
// it is a wrapper around the component we are trying to show

// the object returned by AppComponent.getInitialProps
// ie {pageProps, currentUser}
// is passed to it in addition with Component
const AppComponent = ({ Component, pageProps, currentUser}) =>{
    return (
    <div> 
        <Header currentUser = {currentUser} />
        < Component currentUser = {currentUser} {...pageProps} />
    </div>);
};

AppComponent.getInitialProps = async(appContext) =>{
    const client = buildClient(appContext.ctx);
    const response = await client.get('/api/users/currentuser');

// check if component has getIntitalProps 
//if it does execute the if statement   

    let pageProps = {};
    if (appContext.Component.getInitialProps){
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, response.data.currentUser);
    }
    
    return {
        pageProps,
        currentUser: response.data.currentUser
    }   
};

export default AppComponent;

