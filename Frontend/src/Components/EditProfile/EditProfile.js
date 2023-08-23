import React, { useState, useEffect } from 'react';
import { BsXLg, BsCheckLg } from 'react-icons/bs'
import UserService from '../../Services/user.service'
import AuthService from '../../Services/auth.service';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';

export default function EditProfile(props) {

    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [password, setPassword] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [userType, setUserType] = useState([]);
    const [operationalManager, setOperationalManager] = useState('');
    const [municipalityAnalytics, setMunicipalityAnalytics] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [isMunicipal, setIsMunicipal] = useState(false);
    const [error, setError] = useState('');
    const [age, setAge] = useState('');
    const [wallet, setWallet] = useState('');
    const [gender, setGender] = useState('');
    const [editing, setEditing] = useState(true);
    const [statusOption, setStatusOption] = useState(true);

    const [Male, setMale] = useState(false);
    const [Female, setFemale] = useState(false);
    const [Other, setOther] = useState(false);

    const initArrays = async () => {
        try {


            let user = await AuthService.getCurrentUser();
            setId(user.id ?? '');
            setName(user.name ?? '');
            setEmail(user.email ?? '');
            setPassword('');
            setImgUrl(user.imgUrl ?? '');
            setCity(user.city ?? '');
            setUserType(user.userType ?? '')
            setLat(user.lat ?? '');
            setLng(user.lng ?? '');
            setAge(user.age ?? '');
            setGender(user.gender ?? '');
            setWallet(user.wallet ?? '');
            setError('');


        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        initArrays();
    }, []);

    // Function to validate Fields 
    function validateFields() {
        const validURL = (str) => {
            var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
            return !!pattern.test(str);
        }
        const validatPassword = () => {
            const passw = /^[A-Za-z]\w{7,14}$/;
            if (password.match(passw))
                return true;
            else
                return false;
        }
        const validatAge = () => {
            if (age && age > 0 && age < 100)
                return true;
            else
                return false;
        }
        const validatEmail = () => {
            var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regex.test(String(email).toLowerCase());

        }

        let error = "";
        if ((name === "" || email === "" || imgUrl === "" || password === "" || age === "" || gender === "")) {
            error += "Fields can't be empty!\n";
        }
        if (imgUrl && !validURL(imgUrl)) {
            error += "Image url is an invalid URL!\n"
        }
        if (age && !validatAge(age)) {
            error += "Age must be positive and lower than 100!\n"
        }
        if (email && !validatEmail(email)) {
            error += "invalid Email!\n"
        }
        if (password && !validatPassword(password)) {
            error += "Must be password between 6 to 20 characters which contain at least one numeric digit,one uppercase and one lowercase letter!\n"
        }

        if (error === "") {
            return true;
        }

        setError(error);
        return false;
    }

    function clearFields() {
        setId('');
        setName('');
        setEmail('');
        setPassword('');
        setImgUrl('');
        setCity('');
        setAge('');
        setGender('');
        setUserType('');
        setOperationalManager('');
        setMunicipalityAnalytics('');
        setLat('');
        setLng('');
        setError('');
        setAge('');
        setGender('');
        setWallet('');
    }

    function createObject() {
        const obj = {
            _id: id,
        };
        if (isMunicipal) {
            obj.name = name;
            obj.email = email;
            obj.password = password;
            obj.imgUrl = imgUrl;
            obj.age = age;
            obj.gender = gender
            obj.userType = userType;
        }
        else {
            obj.name = name;
            obj.email = email;
            obj.password = password;
            obj.imgUrl = imgUrl;
            obj.age = age;
            obj.gender = gender
            obj.userType = userType;
        }
        return obj;
    }


    const saveObject = async (obj) => {

        if (obj) {
            try {
                const result = await UserService.updateProfileUser(obj._id, obj.name, obj.email, obj.password, obj.imgUrl, obj.age, obj.gender);
                UserService.updateCurrentUser(false);
            } catch (err) {
                console.error(err);
            }
        }
        setEditing(false);
    }

    function save(e) {
        e.preventDefault();
        if (validateFields()) {
            const obj = createObject();
            clearFields();
            saveObject(obj);
        }
    }
    function cancel(e) {
        e.preventDefault();
        navigate(-1);
    }


    function onHandleChange({ target: { value } }, setCallback) {
        if (value == 'Municipality Analytics') {
            const userTypes = {
                operationalManager: false,
                municipal: true,
                admin: false,
                recycler: false,
            }
            setCallback(userTypes);
        }
        else if (value == 'Operational Manager') {
            const userTypes = {
                operationalManager: true,
                municipal: false,
                admin: false,
                recycler: false,
            }
            setCallback(userTypes);
        }
        else {
            setCallback(value);
        }
    }


    return (
        <div className='Edit'>
            <div className='mywrapper'>
                {editing ? (
                    <form className='mydashform'>
                        <span className='mydashform-title'>{"Edit Profile"}</span>
                        <input type="hidden" name="id" value={id} />

                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => onHandleChange(e, setName)}
                            className='overflow-text'
                        />

                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            name="email"
                            placeholder="Information"
                            value={email}
                            onChange={(e) => onHandleChange(e, setEmail)}
                            className='overflow-text'
                        />

                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => onHandleChange(e, setPassword)}
                            className='overflow-text'
                        />

                        <label htmlFor="img">ImageUrl</label>
                        <input
                            type="imageUrl"
                            name="ImageUrl"
                            placeholder="ImageUrl"
                            value={imgUrl}
                            onChange={(e) => onHandleChange(e, setImgUrl)}
                            className='overflow-text'
                        />

                        <label htmlFor="gender">Gender</label>
                        <select
                            name="gender"
                            value={gender}
                            onChange={(e) => onHandleChange(e, setGender)}
                        >
                            {statusOption ? <option value="" selected disabled  >gender</option> : <option value="" disabled  >gender</option>}
                            {Male ? <option value="Male" selected  >Male</option> : <option value="Male">Male</option>}
                            {Female ? <option value="Female" selected>Female</option> : <option value="Female" >Female</option>}
                            {Other ? <option value="Other" selected>Other</option> : <option value="Other" >Other</option>}
                        </select>

                        <label htmlFor="lng">Age</label>
                        <input
                            type="Age"
                            name="Age"
                            placeholder="Age"
                            value={age}
                            onChange={(e) => onHandleChange(e, setAge)}
                            className='overflow-text'
                        />

                        <div className='mydashform-tool-box'>
                            <button
                                className='btn-round'
                                onClick={save}
                            >
                                <BsCheckLg />
                            </button>
                            <button
                                className='btn-round'
                                onClick={cancel}
                            >
                                <BsXLg />
                            </button>
                        </div>
                        <div style={{ color: 'red', whiteSpace: "pre-line" }}>{error}</div>
                    </form>
                ) : (
                    <div>Your profile has been updated</div>
                )}
            </div>
        </div>
    );
}