import React, { useState, useEffect } from 'react'
import classes from './headerpage.module.css'
import Popup from 'reactjs-popup';
import Profile from '../Profile/profile';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../Services/auth.service';

function HeaderPage(props) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    let currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      // If the user is not logged in, navigate to the login page
      navigate('/login');
    }
  }, [])

  return (
    <header className={classes.pageHeader}>
      {/* Render a back button if 'prev' prop is provided, otherwise render the logo */}
      {props.prev ? <button className={classes.pageBack} onClick={() => navigate(-1)} /> : <Link to="/" id={classes.logo}/>}
      {/* Render the page title if 'title' prop is provided */}
      {props.title ? <span className={classes.pageTitle}>{props.title}</span> : ''}
      {/* Render the profile popup */}
      <Popup trigger={<button className={classes.profile}></button>} modal>
        <Profile />
      </Popup>
    </header>
  )
}

export default HeaderPage;
