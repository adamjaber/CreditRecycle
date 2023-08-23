import React from 'react';
import './settings.css';
import AuthService from '../../Services/auth.service';
import { Link } from 'react-router-dom';

function Settings() {
    const logOut = () => {
        AuthService.logout();
    };
    return (
        <>
            <div className='setiings'>
                <div className='hr-line' />
                <div className='settings-options'>
                    <Link to="/EditProfile" id='account-icon'>
                        Edit Profile
                    </Link>
                    <div className='hr-line' />
                    <span id='notification-icon'>Notification</span>
                    <div className='hr-line' />
                    <span id='appearance-icon'>Appearance</span>
                    <div className='hr-line' />
                    <span id='privacy-icon'>Privacy</span>
                    <div className='hr-line' />
                    <Link to='/help' id='support-icon'>
                        Help & Support
                    </Link>
                    <div className='hr-line' />
                    <Link to='/login' id='log-out-icon' onClick={logOut}>
                        Logout
                    </Link>
                </div>
            </div>
        </>
    );

}

export default Settings;


