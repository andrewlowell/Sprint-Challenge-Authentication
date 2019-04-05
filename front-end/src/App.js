import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
import './App.css';
import Login from './components/LogIn';
import Signup from './components/SignUp';
import Jokes from './components/Jokes';

class App extends Component {
  state = {
    logged_in: false 
  }

  componentDidMount() {
    if (localStorage.hasOwnProperty('token')) {
      this.setState({ logged_in: true });
    } else {
      this.setState({ logged_in: false });
    }
  }

  render() {
    return (
      <div className="App">
        <header>
          <NavLink to="/">Home</NavLink>
          &nbsp;|&nbsp;
          <NavLink to="/signup">Signup</NavLink>
          &nbsp;|&nbsp;
          <NavLink to="/login">Login</NavLink>
          &nbsp;|&nbsp;
          <NavLink to="/jokes">Jokes</NavLink>
          &nbsp;|&nbsp;
          <>{this.state.logged_in ? '' : <button onClick={this.logout}>Logout</button>}</>
        </header>
        <Route path="/" exact component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/jokes" component={Jokes} />
      </div>
    );
  }

  logout = () => {
    localStorage.removeItem('token');
    this.setState({ logged_in: false })
  };

}

function Home() {
  return <h1>Home</h1>;
};

export default App;
