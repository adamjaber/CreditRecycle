import React, { useState, useEffect } from 'react';
import { BsXLg, BsCheckLg } from 'react-icons/bs'
import RecycleBinService from '../../Services/recycleBin.service';
import UserService from '../../Services/user.service';
import UtilService from '../../Services/util.service';
import AuthService from '../../Services/auth.service';
import { useNavigate } from 'react-router-dom';
import './report.css';

export default function EditProfile(props) {

  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');
  const [selectedBin, setSelectedBin] = useState('');
  const [binAddresses, setBinAddresses] = useState('');
  const [recyclebins, setRecyclebins] = useState([]);

  const initArrays = async () => {
    try {
      let user = await AuthService.getCurrentUser();
      setId(user.id ?? '');
      // Get the list of recycle bins from the recycle bin service
      setRecyclebins((await RecycleBinService.getBins()).data);

      const binsResponse = (await RecycleBinService.getBins());
      setRecyclebins(binsResponse.data);

      const addresses = await Promise.all(binsResponse.data.map(bin => UtilService.fetchAddress(bin.location.lat, bin.location.lng)));
      setBinAddresses(addresses);

    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    initArrays();

  }, []);

  // Function to validate Fields 
  function validateFields() {

    const validatEmail = () => {
      var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(String(email).toLowerCase());
    }

    const validateNumber = () => {
      const regex = /^[0-9]+$/;
      return regex.test(phone);
    }

    let error = "";

    if (email === "" || reason === "" || description === "" || phone === "") {
      error += "Fields can't be empty!\n";
    }

    if (phone && !validateNumber()) {
      error += "invalid phone!\n"
    }
    if (email && !validatEmail()) {
      error += "invalid Email!\n"
    }

    if (error === "") {
      return true;
    }

    setError(error);
    return false;
  }

  function createObject() {
    const obj = {
      _id: id,
    };

    obj.email = email;
    obj.reason = reason;
    obj.description = description;
    obj.phone = phone;
    obj.selectedBin = selectedBin;

    return obj;
  }

const saveObject = async (obj) => {
  if (obj) {
    try { 
      const respond = await UserService.addReport(obj.reason , obj.description ,obj.email , obj.phone ,  obj.selectedBin);
      setEditing(false);
    } catch (error) {
      setEditing(true);
      console.error(error);
    }
  }
};

  function save(e) {
    e.preventDefault();
    if (validateFields()) {
      const obj = createObject();
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
            <span className='mydashform-title'>{"Report"}</span>

            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => onHandleChange(e, setEmail)}
              className='overflow-text'
            />

            <label htmlFor="Reason">Report Reason</label>
            <select
              name="Reason"
              value={reason}
              onChange={(e) => onHandleChange(e, setReason)}
            >
              <option value="" disabled hidden>Select a reason</option>
              <option value="Full Smart Bin">Full Smart Bin</option>
              <option value="Missing or damaged recycling bin">Missing or damaged recycling bin</option>
              <option value="Recycling process is not accepting certain materials">Recycling process is not accepting certain materials that should be recyclable</option>
            </select>

            <label htmlFor="lng">Phone</label>
            <input
              type="Phone"
              name="Phone"
              placeholder="Phone"
              value={phone}
              onChange={(e) => onHandleChange(e, setPhone)}
              className='overflow-text'
            />

            <label htmlFor="lng">description</label>
            <input
              type="description"
              name="description"
              placeholder="description"
              value={description}
              onChange={(e) => onHandleChange(e, setDescription)}
              className='overflow-text'
            />

            <label htmlFor="bin">Select a Bin</label>
            <select
              name="bin"
              value={selectedBin}
              onChange={(e) => onHandleChange(e, setSelectedBin)}
            >
              <option value="" disabled hidden>Select a bin</option>
              {recyclebins.map((bin, index) => (
                <option key={bin._id} value={bin._id}>
                  {binAddresses[index]}
                </option>
              ))}
            </select>

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
          <div>Your Report has been sending</div>
        )}
      </div>
    </div>
  );

}