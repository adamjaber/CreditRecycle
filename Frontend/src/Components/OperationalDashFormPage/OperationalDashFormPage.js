import React, { useState, useEffect } from 'react';
import { BsPlusLg, BsXLg, BsCheckLg } from 'react-icons/bs'
import UserService from '../../Services/user.service'
import AuthService from '../../Services/auth.service';
import UtilService from '../../Services/util.service';
import './OperationalDashFormPage.css';


export default function DashFormPage(props) {
    const [id, setId] = useState('');
    const initArrays = async () => {
        try {
                 let user_ = await AuthService.getCurrentUser();
                 let users = (await UserService.getUsers('?sort=wallet')).data;
                 let localMunicipalUsers = (users.filter(user => (user._id === user_.id) && (user.userType.municipal === true)));
                 const address = localMunicipalUsers && localMunicipalUsers.length > 0
                 ? localMunicipalUsers[0].city
                 : "Default Value";
                 let city = await UtilService.fetchAddress(lat,lng);
                 const Cord = city.split(", ")[1]; // Split the address by comma and get the second element
                 if (Cord === address) {
                   return 1;
                 } else {
                    return 0;
                 }

            }  catch (err) {
                console.error('Error:', err);
                return null;
            }
    };

    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [maxCapacity, setMaxCapacity] = useState('');
    const [status, setStatus] = useState('');
    const [plasticCurrentCapacity, setPlasticCurrentCapacity] = useState('0');
    const [glassCurrentCapacity, setGlassCurrentCapacity] = useState('0');
    const [canCurrentCapacity, setCanCurrentCapacity] = useState('0');
    const [error, setError] = useState('');
    const [active, setActive] = useState(false);
    const [inactive, setInactive] = useState(false);
    const [statusOption, setStatusOption] = useState(true);

    useEffect(() => {
        if (props.editing && props.currentObject._id !== id) {
            setId(props.currentObject._id ?? '');
            setLat(props.currentObject.location?.lat ?? '');
            setLng(props.currentObject.location?.lng ?? '');
            setMaxCapacity(props.currentObject.maxCapacity ?? '');
            setPlasticCurrentCapacity(props.currentObject.plasticCurrentCapacity ?? '');
            setGlassCurrentCapacity(props.currentObject.glassCurrentCapacity ?? '');
            setCanCurrentCapacity(props.currentObject.canCurrentCapacity ?? '');
            setStatus(props.currentObject.status ?? '');
            if (props.currentObject.status === 'active') {
                setActive(true);
                setInactive(false);
            }
            else {
                setActive(false);
                setInactive(true);
            }
            setError('');
        }
    }, [props]);

    async function validateFields() {
        let error = "";
        const initResult = await initArrays();
        if (initResult === 0) {
            error += " lat and long do not correspond to your city!\n";
        } else if (!lat || !lng || !maxCapacity || !status) {
            error += "Fileds cannot be empty!\n";
        } else if (+maxCapacity <= 0) {
            error += "Max Capacity must be positive!\n";
        } else if (+plasticCurrentCapacity < 0 || +glassCurrentCapacity < 0 || +canCurrentCapacity < 0) {
            error += "Current Capacity can't be negative!\n";
        }
        if (error === "") {
            return true;
        }
        setError(error);
        return false;
    }
    

    function clearFields() {
        setId('');
        setLat('');
        setLng('');
        setStatus('');
        setMaxCapacity('');
        setPlasticCurrentCapacity('0');
        setGlassCurrentCapacity('0');
        setCanCurrentCapacity('0');
        setActive(false);
        setInactive(false);
        setStatusOption(true);
        setError('');
    }

    function createObject() {
        const obj = {
            _id: id,
        };
        obj.location = {
            lat,
            lng
        };
        obj.maxCapacity = +maxCapacity;
        obj.status = status;
        obj.capacity = {
            plastic: +plasticCurrentCapacity,
            can: +canCurrentCapacity,
            glass: +glassCurrentCapacity,
        }
        return obj;
    }

    async function add(e) {
        e.preventDefault();
        if (await validateFields()) {
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
        setCallback(value);
    }

    return (
        <div className='dashform-wrapper'>
            <form className='dashform' style={props.editing ? { backgroundImage: "none" } : {}}>
                <span className='dashform-title'>{props.editing ? "Edit a Bin" : "Add a new Bin"}

                </span>
                <input type="hidden" name="id" value={id} />
                <>
                    <label htmlFor="Bin Id">Bin Id</label>
                    <input type="text" name="binId" placeholder="Bin Id"
                        value={id} onChange={e => onHandleChange(e, setId)}
                        className='overflow-text' readOnly />

                    <label htmlFor="lat">Latitude</label>
                    <input type="number" name="lat" placeholder="Latitude"
                        value={lat} onChange={e => onHandleChange(e, setLat)}
                        className='overflow-text' />

                    <label htmlFor="lng">Longitue</label>
                    <input type="number" name="lng" placeholder="Longitue"
                        value={lng} onChange={e => onHandleChange(e, setLng)}
                        className='overflow-text' />

                    <label htmlFor="maxCapacity">Max Capacity</label>
                    <input type="number" name="maxCapacity" placeholder="Max Capacity" min="0"
                        value={maxCapacity} onChange={e => onHandleChange(e, setMaxCapacity)}
                        className='overflow-text' />

                    <label htmlFor="Status">Status</label>
                    <select id="Status" name="Status" onChange={e => onHandleChange(e, setStatus)} >
                        {statusOption ? <option value="" selected disabled  >Status</option> : <option value="" disabled  >Status</option>}
                        {active ? <option value="active" selected  >active</option> : <option value="active">active</option>}
                        {inactive ? <option value="inactive" selected>inactive</option> : <option value="inactive" >inactive</option>}
                        
                    </select>

                    <div className='capacity-names'>
                        <label htmlFor="plasticCurrentCapacity">Plastic Capacity</label>
                        <label htmlFor="canCurrentCapacity">Can Capacity</label>
                        <label htmlFor="glassCurrentCapacity">Glass Capacity</label>
                    </div>
                    <div className='capacity-inputs'>
                        <input type="number" name="currentCapacity" placeholder="0" readOnly
                            value={plasticCurrentCapacity} onChange={e => onHandleChange(e, setPlasticCurrentCapacity)}
                            className='overflow-text' />

                        <input type="number" name="currentCapacity" placeholder="0" readOnly
                            value={canCurrentCapacity} onChange={e => onHandleChange(e, setCanCurrentCapacity)}
                            className='overflow-text' />

                        <input type="number" name="currentCapacity" placeholder="0" readOnly
                            value={glassCurrentCapacity} onChange={e => onHandleChange(e, setGlassCurrentCapacity)}
                            className='overflow-text' />
                    </div>

                </>

                <div className='dashform-tool-box'>
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
    );

}