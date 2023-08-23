import React, { useState, useEffect } from 'react';
import recycling from '../../Images/sign-arrows.gif';
import { IoMdQrScanner } from 'react-icons/io';
import classes from './Recycle.module.css';
import { Link, useSearchParams } from 'react-router-dom';
import RecycleBinService from '../../Services/recycleBin.service';
import RecycleResult from '../RecycleResult/RecycleResult';
import UserService from '../../Services/user.service';
import UtilService from '../../Services/util.service';
import AuthService from '../../Services/auth.service';
import { useLocation } from 'react-router-dom';

const types = ['plastic', 'glass', 'paper', 'can'];
function Recycle(props) {
    const location = useLocation();
    const [recyclingStatus, setRecyclingStatus] = useState('');
    const [binApi, setBinApi] = useState('');
    const [bin, setBin] = useState({});
    const [searchParam, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [activity, setActivity] = useState(null);
    const [userCity , setUserCity] = useState("");

    useEffect( () => {
        const fetchData = () => {
            const city = localStorage.getItem('userCity');
            console.log(city);
            console.log('?binId=' + searchParam.get('binId') + `&userId=${AuthService.getCurrentUser().id}`);

            setUserCity(city);
            setBinApi('?binId=' + searchParam.get('binId') + `&userId=${AuthService.getCurrentUser().id}`);
          };
        
          fetchData();
    }, []);

    const startRecycle = async () => {
        try {

            // get the address of the bin
            let respond = await RecycleBinService.getBin(binApi.split('binId=')[1].split('&')[0]);
            let city = await UtilService.fetchAddress(respond.data.location.lat, respond.data.location.lng);
            // recycle if we near the bin
            if (city.split(", ")[1] === userCity) {
                setBin(respond.data);
                RecycleBinService.startRecycle(binApi)
                  .then(response => {
                    // Successful request
                    // You can handle the successful response here if needed
                    // setRecyclingStatus(true);
                  })
                  .catch(error => {
                    // Failed request
                    setRecyclingStatus('error');
                    console.error(error);
                  });

                  if(recyclingStatus !== 'error'){
                    setRecyclingStatus('ok')
                  }
              }
        }
        catch (err) {
            console.error(`get bin failed: ${err}`);
            return;
        }
    }

    useEffect(() => {
        if (  binApi) {
            startRecycle();
        }
    }, [ binApi ]);
    const submitRecycle = async () => {
        /// send stop request to raspberry pi api 
        try {
            setLoading(true);

            const respond = await RecycleBinService.stopRecycle(binApi);
            setActivity({ points: Number(respond.data) });
            UserService.updateCurrentUser(true);
        } catch (err) {
            console.error(err);
            setActivity({ points: 0 });
        }
    }

    const renderReady = () => (
        <>
            <h3 className={classes.h3} >
                Are you ready?
            </h3>

            <span className={classes.info} >
                before start to scan, let's prepare the items you want to recycle
            </span>
            <Link to='/qrscanner' className={classes.a}>
                <IoMdQrScanner style={{ verticalAlign: 'middle' }} /> Scan
            </Link>
        </>
    );

    const renderRecycling = () => (
        <>
            <h3 className={classes.h3} >
                Recycling on processing
            </h3>
            <div className={classes.items}>
                <img src={recycling} alt="My animated GIF" />
            </div>
        </>
    );

    return (
        loading ? <RecycleResult proccessing={activity === null} points={activity?.points} /> : <>
            <div className={classes.cover} />

            {recyclingStatus === 'ok' ? renderRecycling() : renderReady()}
            {recyclingStatus === 'ok' ? <button className={classes.next} onClick={submitRecycle}></button> : ''}
        </>
    )
}

export default Recycle;