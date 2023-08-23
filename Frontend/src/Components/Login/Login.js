import React, { useState, useRef } from 'react';
import plant from '../../Images/holding-plant.svg';
import classes from './Login.module.css';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import { Link, useNavigate } from "react-router-dom";
import AuthService from '../../Services/auth.service';

function Login(props) {
    const form = useRef(); // Ref for the form
    const checkBtn = useRef(); // Ref for the validation check button
    const [email, setEmail] = useState(''); // State for the email input
    const [password, setPassword] = useState(''); // State for the password input
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [message, setMessage] = useState(''); // State for error/success message
    const navigate = useNavigate(); // Navigation hook from React Router

    const handleChange = (value, callback) => {
        callback(value);
    }

    const checkRequired = value => {
        if (!value) {
            return (
                <div className={classes.invalidFeedback}>
                    This field is required!
                </div>
            )
        }
    };

    const checkEmail = value => {
        if (!isEmail(value)) {
            return (
                <div className={classes.invalidFeedback}>
                    This is not a valid email.
                </div>
            )
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        form.current.validateAll();
        if (checkBtn.current.context._errors.length === 0) {
            AuthService.login(email, password).then(
                () => {
                    navigate('/'); // Redirect to home page on successful login
                    window.location.reload(); // Refresh the page
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    setLoading(false);
                    setMessage(resMessage);
                }
            );
        } else {
            setLoading(false);
        }
    };

    return (
        <div className={classes.container}>
            <Form
                onSubmit={handleLogin}
                ref={form}
            >
                <img src={plant} className={classes.img} />
                <h3 className={classes.h3}>Hello!</h3>
                <div className={classes.credentials}>
                    <Input type='email'
                        placeholder='E-mail'
                        className={classes.input}
                        validations={[checkRequired, checkEmail]}
                        name='email'
                        value={email}
                        onChange={(e) => handleChange(e.target.value, setEmail)}
                    />
                    <Input type='password'
                        placeholder='Password'
                        className={classes.input}
                        style={{ marginTop: '18px' }}
                        validations={[checkRequired]}
                        name='password'
                        value={password}
                        onChange={(e) => handleChange(e.target.value, setPassword)}
                    />
                </div>
                <div>
                    <button className={classes.login}>Log In</button>
                    <span className={classes.span}>OR</span>
                    <Link to='/signup' className={classes.signup}>Sign Up</Link>
                </div>
                {message && (
                    <div className="form-group">
                        <div className="alert alert-danger" role="alert">
                            {message}
                        </div>
                    </div>
                )}
                <CheckButton style={{ display: "none" }} ref={checkBtn} />
            </Form>
        </div>
    )
}

export default Login;