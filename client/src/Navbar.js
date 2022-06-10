import React from 'react'
import {  Link   } from 'react-router-dom'
import logo from './tf-logo.svg'

const Navbar = (props) => {

    const currentUser = props.user

    return(

        <nav className="navbar navbar-expand style-ribbon">
            
            <div className="container-fluid">

                <div className="navbar-nav mr-auto" >            
                    <li className="nav-item">
                        <Link to={"/Home"} className="nav-link">
                            <div style={{'width': '30px'}}>
                                <img src={logo} className="App-logo" alt="logo"/>
                            </div>
                        </Link>                           
                    </li> 
                </div>

                <div className="navbar-header">Task Director</div>

                {currentUser ? (
                    <ul className="nav navbar-nav navbar-right">
                    
                        <li >
                            <Link to={"/Scope"} className="nav-link style-ribbon">{currentUser.first_name}</Link>
                        </li>
                        
                        <li >
                            <a href="/Home" className="nav-link style-ribbon" onClick={props.logOut}>LogOut</a>
                        </li>
                    
                    </ul>
                ) : (
                    <ul className="nav navbar-nav navbar-right">
                        
                        <li>
                            <Link to={"/Login"} className="nav-link style-ribbon">Login</Link>
                        </li>
                        
                        <li>
                            <Link to={"/Register"} className="nav-link style-ribbon">Register</Link>
                        </li>
                    
                    </ul>
                )}
            
            </div>
        </nav>



    )
}

export default Navbar