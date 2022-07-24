import Link from 'next/link'; // adding hyberbolic link
// this will be run in our browser
// response.data is passed to this function 
// {currentUser} is extracted from reponse.data ie
// instead of doing response.data.currentUser u can just
// do {currentUser}
// add tickets to be received from the getinitialprops
const LandingPage = ({currentUser, tickets}) =>{
    //looping over the list of tickets
    const ticketList = tickets.map((ticket) => {
        return (
          <tr key={ticket.id}>
            <td>{ticket.title}</td>
            <td>{ticket.price}</td>
            <td>
                <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                    <a>View</a>
          </Link>
        </td>
          </tr>
        );
      });
    
      // creating table for the tickets
      return (
        <div>
          <h1>Tickets</h1>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>{ticketList}</tbody>
          </table>
        </div>
      );
    };

// this is executed during the server side rendering after rendering we will rely 
//on the components
//during the server side rendering we need to make check if user is signed in 
// we will do that in the  getInitialProps
// useRequest can  only be used in react component and during the server side rendering
// we can't fetch data from react component

// this is run on the server
LandingPage.getInitialProps = async (context, client, currentUser) =>{
    // this to fetch all tickets from the database during intial loading
    const { data } = await client.get('/api/tickets');

    return { tickets: data };
  
}


export default LandingPage;