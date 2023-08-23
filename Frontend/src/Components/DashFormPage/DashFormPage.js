import React, { useState, useEffect } from 'react';
import { BsPlusLg, BsXLg, BsCheckLg } from 'react-icons/bs'
import './DashFormPage.css';
export default function DashFormPage(props) {
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

    useEffect(() => {
        setIsMunicipal(props.isMunicipal);
        if (props.editing && props.currentObject._id !== id) {
            setId(props.currentObject._id ?? '');
            setName(props.currentObject.name ?? '');
            setEmail(props.currentObject.email ?? '');
            setPassword(props.currentObject.password ?? '');
            setImgUrl(props.currentObject.imgUrl ?? '');
            setCity(props.currentObject.city ?? '');
            setUserType(props.currentObject.userType ?? '')
            setLat(props.currentObject.lat ?? '');
            setLng(props.currentObject.lng ?? '');
            setAge(props.currentObject.age ?? '');
            setWallet(props.currentObject.wallet ?? '');
            setGender(props.currentObject.gender ?? '');


            if (props?.currentObject?.userType?.operationalManager && props.currentObject.userType.operationalManager == true) {
                setOperationalManager('Operational Manager');
                setMunicipalityAnalytics('');
            }
            else {
                setMunicipalityAnalytics('Municipality Analytics');
                setOperationalManager('');
            }

            setError('');
        }
    }, [props]);

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

        let error = "";
        if (isMunicipal && (name === "" || email === "" || imgUrl === "" || password === "")) {
            error += "Fields can't be empty!\n";
        }
        if (imgUrl && !validURL(imgUrl)) {
            error += "Image url is an invalid URL!\n"
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
            obj.city = city;
            obj.userType = userType;
        }
        else {
            obj.name = name;
            obj.email = email;
            obj.password = password;
            obj.imgUrl = imgUrl;
            obj.city = city;
            obj.userType = userType;
        }
        return obj;
    }

    function add(e) {
        e.preventDefault();
        if (validateFields()) {
            const obj = createObject();
            clearFields();
            props.add(obj);
        }
    }

    function cancel(e) {
        e.preventDefault();
        clearFields();
        props.cancel();
    }

    function save(e) {
        e.preventDefault();
        if (validateFields()) {
            const obj = createObject();
            clearFields();
            props.save(obj);
        }
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
        <>
            {props.isMunicipal ?
                <>
                    <div className='mywrapper'>
                        <form className='mydashform' style={props.editing ? { backgroundImage: "none" } : {}}>
                            <span className='mydashform-title'>{props.editing ? "Edit a" : "Add a new"} {props.isMunicipal ? 'municipal' : 'recycler Users'}</span>
                            <input type="hidden" name="id" value={id} />

                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" placeholder="Name"
                                value={name} onChange={e => onHandleChange(e, setName)}
                                className='overflow-text' />

                            <label htmlFor="municipalType">Municipal Type</label>
                            <select id="Municipal Type" name="Municipal Type" onChange={e => onHandleChange(e, setUserType)} >
                                <option value="" selected> Municipal Type</option>
                                {operationalManager ? <option value="Operational Manager" selected  > Operational Manager</option> : <option value="Operational Manager"> Operational Manager</option>}
                                {municipalityAnalytics ? <option value="Municipality Analytics" selected>Municipality Analytics</option> : <option value="Municipality Analytics" >Municipality Analytics</option>}

                            </select>
                            <label htmlFor="email">Email</label>
                            <input type="text" name="email" placeholder="Information"
                                value={email} onChange={e => onHandleChange(e, setEmail)}
                                className='overflow-text' />

                            <label htmlFor="password">Password</label>
                            {props.editing ?

                                <input type="password" name="password" placeholder="password"
                                    value={password} onChange={e => onHandleChange(e, setPassword)}
                                    className='overflow-text' readOnly /> :

                                <input type="password" name="password" placeholder="password"
                                    value={password} onChange={e => onHandleChange(e, setPassword)}
                                    className='overflow-text' />
                            }
                            <label htmlFor="lat">Latitude</label>
                            <input type="number" name="lat" placeholder="Latitude"
                                value={lat} onChange={e => onHandleChange(e, setLat)}
                                className='overflow-text' />

                            <label htmlFor="lng">Longitue</label>
                            <input type="number" name="lng" placeholder="Longitue"
                                value={lng} onChange={e => onHandleChange(e, setLng)}
                                className='overflow-text' />

                            <div className='mydashform-tool-box'>
                                <button className='btn-round' style={{ display: props.editing ? "none" : "block" }}
                                    onClick={add}><BsPlusLg /></button>
                                <button className='btn-round' style={{ display: props.editing ? "block" : "none" }}
                                    onClick={cancel}><BsXLg /></button>
                                <button className='btn-round' style={{ display: props.editing ? "block" : "none" }}
                                    onClick={save}><BsCheckLg /></button>
                            </div>
                            <div style={{ color: 'red', whiteSpace: "pre-line" }}>{error}</div>
                        </form>
                    </div>
                </>
                :
                <>
                </>
            }

        </>

    );

}