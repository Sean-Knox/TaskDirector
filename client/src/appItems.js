import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link, useNavigate   } from 'react-router-dom'
import Scope from './workItems'
import './appItems.css'
import logo from './tf-logo.svg'

function log(txt){
    const doLog = false
    if (doLog){alert(txt)}
}

const LoginForm =(props)=>{
    
    let navigate = useNavigate()
    
    const onSubmit = (e) =>{
        
        e.preventDefault()
        
        const el = e.currentTarget.elements
        const body={
            email: el.email.value,
            password: el.password.value           
        }
        
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {'Content-type': 'application/json' }
        } 
        
        fetch('http://localhost:4001/login', requestOptions)
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('token', data.token)
                props.onSubmit()
                navigate("/Scope")
            })
            .catch(error => {
                alert('Error in onSubmit : ' + error +  ' body=' + JSON.stringify(body))
            })

    }
                                         
    return (
        <div >
            <form onSubmit={onSubmit}>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input className="form-control" type ="email" id = 'email' name="email" placeholder="abc@example.com" required></input>
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input className="form-control" type="password" id = "password" name="password" required></input>
                </div>

                <button type ="submit" className="btn btn-secondary">Submit</button>

            </form>
        </div>


      )


}

const Register = () => {

    let navigate = useNavigate()

    const onSubmit = (e) => {
        e.preventDefault()
        
        const el = e.currentTarget.elements
        const body={
            first_name: el.first_name.value,
            last_name: el.last_name.value,  
            email: el.email.value, 
            password: el.password.value, 
            token: el.token.value
        }
        
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {'Content-type': 'application/json' }
        } 
        
        fetch('http://localhost:4001/register', requestOptions)
            .then(response => response.json())
            .then(data => {
                alert('register good')
                navigate("/Home")
            })
            .catch(error => {
                alert('Error in handleRegister : ' + error +  ' body=' + JSON.stringify(body))
            })

    }
                                        
    return (
        <div >
            <form onSubmit={onSubmit}>

                <div className="mb-3">
                    <label className="form-label" >First Name</label>
                    <input className="form-control" type ="text" id = 'first_name' name="first_name" placeholder="sean" required></input> 
                </div>

                <div className="mb-3">
                    <label className="form-label" >Last Name</label>
                    <input className="form-control" type ="text" id = 'last_name' name="last_name" placeholder="knox" required></input> 
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input className="form-control" type ="email" id = 'email' name="email" placeholder="abc@example.com" required></input> 
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input  className="form-control" type="password" id = "password" name="password" required></input> 
                </div>

                <div className="mb-3" style={{display:'none'}}>
                     <input type="text" id = "token" name="token"  value=""></input>          
                </div>

                <button className="btn btn-secondary" type ="submit">Submit</button>

            </form>

        </div>
        
      )


}
  
class Home extends React.Component {

    render() {
      
        return (
            <div>Home</div>
        )
    }

}

export default class App extends React.Component {
    
    constructor(props) {
        super(props)
        this.state={
            currentUser: undefined
        }
        this.logOut = this.logOut.bind(this)
        this.handleLogin = this.handleLogin.bind(this)
        this.getUser = this.getUser.bind(this)
    }
    
    getUser(){
        log('getUser')
        const requestOptions = {
            method: 'GET',
            headers: {
                'authorization': localStorage.getItem('token'),
                'Content-type': 'application/json' 
            }
        }           

        fetch('http://localhost:4001/getCurrentUser', requestOptions)
            .then(response => response.json())
            .then(data => {
                const user = data                
                if (user) {
                    this.setState({currentUser: user})
                }
            })
            .catch(error => {
                alert('Error in fetch')
                //this.setState({currentUser: undefined})
            })        
    }
    
    componentDidMount() {
        log('componentDidMount App')
        this.getUser()
    }
    
    handleLogin(){
        this.getUser()
    }

    logOut() {
        localStorage.setItem('token', undefined)
        this.setState({currentUser: undefined})       
    }

    render() {
        
        log('Rendering App')

        const {currentUser} = this.state
        //navbar-dark bg-dark 

        return (
            
            <Router>

            
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
                        <a href="/Home" className="nav-link style-ribbon" onClick={this.logOut}>LogOut</a>
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

        

                <div className="container mt-3">
                  <Routes>
                    <Route exact path="/" element={<Home/>} />
                    <Route path="/Home" element={<Home/>} />
                    <Route path="/Login" element={<LoginForm onSubmit={this.handleLogin} />} />
                    <Route path="/Register" element={<Register/>} />
                    <Route path="/Scope" element={<Scope/>} />
                  </Routes>
                </div>
            


            </Router>
          )
    }
}
