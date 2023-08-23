import React, { useState, useEffect } from 'react';
import readyPic from '../../Images/ready-picture.svg';
import ItemCard from '../ItemCard/ItemCard';
import classes from './Signup.module.css';
import AuthService from '../../Services/auth.service';
import { useNavigate } from 'react-router-dom';

function Signup(props) {
    // Function to validate name
    const validatName = () => {
        if (name)
            return true;
        else
            return false;
    }
    // Function to validate Email
    const validatEmail = () => {
        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());

    }

    // Function to validate password
    const validatPassword = () => {
        const passw = /^[A-Za-z]\w{7,14}$/;
        if (password.match(passw))
            return true;
        else
            return false;
    }

    // Function to validate age
    const validatAge = () => {
        if (age && age > 0 && age < 100)
            return true;
        else
            return false;
    }

    // Function to validate picture
    const validatPic = () => {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(picture);
    }
    // State variables
    const [stage, setStage] = useState(0);
    const [title, setTitle] = useState('Please enter your e-mail address');
    const [gender, setGender] = useState('Other');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState(0);
    const [validInput, setValidInput] = useState('');
    const [ready, setReady] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [picture, setPicture] = useState('');
    const [useDefaultPicture, setUseDefaultPicture] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleUploadPicture = (value) => {
        setPicture(value);
        setUseDefaultPicture(false);
    };

    const handleUseDefaultPicture = () => {
        setPicture('https://peaceriver.ca/wp-content/uploads/2015/09/recycle1-870x385.jpg'); // replace with your default picture url
        setUseDefaultPicture(true);
        setShowSuccessMessage(true);
    };

    // Set the title based on the current stage
    useEffect(() => {
        if (stage === 0) {
            setTitle('Please enter your e-mail address');
        } else if (stage === 1) {
            setTitle('Please enter a password');
        } else if (stage === 2) {
            setTitle('What is your name?');
        } else if (stage === 3) {
            setTitle('How old are you?');
        } else if (stage === 4) {
            setTitle('What is your gender?');
        } else if (stage === 5) {
            setTitle('Almost there!\nUpload your image and press next.');
        } else if (stage === 6) {
            setTitle('Your account is ready!');
        }
    }, [stage]);

    // Function to handle the signup process
    const signUp = () => {
        setStage(6);
        setMessage('');
        setLoading(true);
        AuthService.register(email, password, name, age, gender, picture).then(
            () => {
                setMessage('Redirecting...');
                setTimeout(() => {
                    navigate('/');
                    window.location.reload();
                }, 5000);
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
    }

    // Function to validate input based on the current stage
    const validateInput = () => {
        if (stage === 0)
            if (validatEmail()) {
                setStage(stage + 1);
                setValidInput(true);
            }
            else
                setValidInput(false);
        if (stage === 1)
            if (validatPassword()) {
                setStage(stage + 1);
                setValidInput(true);
            }
            else
                setValidInput(false);
        if (stage === 2)
            if (validatName()) {
                setStage(stage + 1);
                setValidInput(true);
            }
            else
                setValidInput(false);
        if (stage === 3)
            if (validatAge()) {
                setStage(stage + 1);
                setValidInput(true);
            }
            else
                setValidInput(false);
        if (stage === 4)
            setStage(stage + 1);
        if (stage === 5)
            if (validatPic()) {
                setReady(true);
                setValidInput(true);
            }
            else
                setValidInput(false);
    }

    const handleChange = (value, callback) => {
        callback(value);
    }

    return (
        <div className={classes.container}>
            <span id={classes.logo} />
            <span className={classes.title}>{title}</span>
            {stage === 0 ?
                <>
                    <input type='email' value={email} placeholder='E-mail' className={classes.input}
                        onChange={e => handleChange(e.target.value, setEmail)} />
                    {validInput === false ? <span className={classes.inputError}>invalid Email</span> : ''}
                </>
                : ''

            }
            {stage === 1 ?
                <>
                    <input type='password' value={password} placeholder='Password' className={classes.input}
                        onChange={e => handleChange(e.target.value, setPassword)} />
                    {validInput === false ? <span className={classes.inputError}>Must be password between 6 to 20 characters which contain at least one numeric digit,
                        one uppercase and one lowercase letter</span> : ''}
                </>
                : <></>
            }
            {stage === 2 ?
                <>
                    <input type='text' value={name} placeholder='Your Name' className={classes.input} style={{ width: '50%' }}
                        onChange={e => handleChange(e.target.value, setName)} />
                    {validInput === false ? <span className={classes.inputError}>Name must be not empty! </span> : ''}
                </>
                : <></>
            }
            {stage === 3 ?
                <>
                    <input type='number' value={age} placeholder='Your Age' className={classes.input} style={{ width: '30%' }}
                        onChange={e => handleChange(e.target.value, setAge)} />
                    {validInput === false ? <span className={classes.inputError}>Age must be positive and lower than 100</span> : ''}
                </>
                : <></>
            }
            {stage === 4 ?
                <>
                    <div className={classes.genders}>
                        <ItemCard type='Male' width='154px' height='76px' onClick={setGender} selected={gender === 'Male' ? true : false} />
                        <ItemCard type='Female' width='154px' height='76px' onClick={setGender} selected={gender === 'Female' ? true : false} />
                        <ItemCard type='Other' width='154px' height='76px' onClick={setGender} selected={gender === 'Other' ? true : false} />
                    </div>
                </>
                : <></>
            }
            {stage === 5 ?
                <>
                    <div>
                        {!useDefaultPicture && (
                            <div>
                                <input
                                    type="url"
                                    value={picture}
                                    placeholder="Profile Picture"
                                    className={classes.input}
                                    onChange={(e) => handleUploadPicture(e.target.value)}
                                />
                                {!validInput ? (
                                    <span className={classes.inputError}>Img must be a url</span>
                                ) : (
                                    ''
                                )}
                                <button
                                    className={classes.pictureButton}
                                    onClick={handleUseDefaultPicture}
                                >
                                    Use Default Picture
                                </button>
                            </div>
                        )}
                        {showSuccessMessage && (
                            <div className={classes.successMessage}>
                                Your upload was successful
                            </div>
                        )}
                    </div>
                </>
                : <>
                </>
            }
            {stage === 6 ?
                <>
                    <img src={readyPic} />
                    <span className={classes.skip}>{message}</span>

                </>
                :
                <>
                    {ready ? <button className={classes.submit} onClick={signUp}>Submit</button>
                        : <button className={`${classes.next} ${classes.nextBack}`} onClick={validateInput}></button>}
                </>
            }
            <>
                {stage === 0 ? <button className={`${classes.back} ${classes.nextBack}`}
                    onClick={() => { navigate(-1) }} /> : ''}
                {(stage !== 0 && stage !== 6) || (stage === 6 && !loading) ? <button className={`${classes.back} ${classes.nextBack}`}
                    onClick={() => { setStage(stage - 1); setReady(false); setMessage('') }} /> : ''}
            </>
        </div >
    )
}
export default Signup;