import Link from 'next/link';

export default({ currentUser }) => {
    const links = [
        !currentUser && {label: "Sign In" , href: "/auth/signin"},
        !currentUser && {label: "Sign Up" , href: "/auth/signup"},
        currentUser && { label: "Sell Tickets", href: "/tickets/new" },
        currentUser && { label: "My Orders", href: "/orders" },
        currentUser &&  {label: "Sign Out" , href: "/auth/signout"}
    ]
    // array will look like [false, false, currentUser &&  {label: "Sign Out" , href: "/auth/signout"}] or 
    //[{label: "Sign In" , href: "/auth/signin"},{label: "Sign Up" , href: "/auth/signup"},false ]
    // now we will filter all the false indices using filter
    //map over each one
     .filter(linkconfig => linkconfig)
     .map(({label, href}) =>{
        return <li key ={href} className="nav-item">
            <Link href={href}>
                <a className="nav-link">{label}</a>
            </Link>
        </li>
     });
    return (<nav className="navbar navbar-light bg-light">
        <Link href={"/"}>
            <a className="nav-brand">GitTix</a>
        </Link>

        <div className="d-flex justify-content-end">
            <ul className="nav d-flex align-items-center">
                {links}
            </ul>
        </div>
    </nav>)
}