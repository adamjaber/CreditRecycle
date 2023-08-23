import React, { useState, useEffect } from 'react';
import classes from './OperationalDashboard.module.css'
import RecycleBinService from '../../Services/recycleBin.service';
import DashFormPage from '../OperationalDashFormPage/OperationalDashFormPage';
import DashHomePage from '../OperationalDashHomePage/OperationalDashHomePage';
import ItemCard from '../ItemCard/ItemCard';
import AuthService from '../../Services/auth.service';
import { useNavigate } from 'react-router-dom';

function AdminDashboard(props) {
    const [recycleBins, setRecyclebins] = useState([]);
    const [editing, setEditing] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [listType, setListType] = useState('Bins');
    const [currentObject, setCurrentObject] = useState({});
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const initArrays = async () => {
        try {
            setRecyclebins((await RecycleBinService.getBins()).data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        setUser(AuthService.getCurrentUser());
        initArrays();
    }, []);

    useEffect(()=>{
        if(user && ! (user.userType.admin ||  user.userType.operationalManager)){
            navigate('/');
        }
    },[user]);

    const addObject = async (obj) => {
            if (currentObject) {
                try {
                  
                    const result = await RecycleBinService.addBin( obj.location.lat, obj.location.lng, obj.maxCapacity);
                    console.log(result);
                    setRecyclebins([...recycleBins, result.data]);
                } catch (err) {
                    console.error(err);
                }
            }
        }
   
    const cancelEdit = () => {
        setCurrentObject({});
        setEditing(false);
    }

    useEffect(() => {
        cancelEdit();
    },[listType]);

    const saveObject = async (obj) => {
       
            if (currentObject) {
                try {

                    const result = await RecycleBinService.updateBin(obj._id, obj.location.lat, obj.location.lng, obj.maxCapacity, obj.capacity.plastic , obj.capacity.can , obj.capacity.glass,obj.status);
                    setRecyclebins(recycleBins.map(bin => bin._id === obj._id ? obj : bin));
                } catch (err) {
                    console.error(err);
                }
            }
    
        setCurrentObject({});
        setEditing(false);
    }

    const deleteObject = async (id) => {
       
            try {
                await RecycleBinService.deleteBin(id);
                setRecyclebins(recycleBins.filter(bin => bin._id !== id));
            } catch (err) {
                console.error(err);
            }
        if (id === currentObject._id) {
            cancelEdit();
        }
    }

    const editObject = (obj) => {
        setCurrentObject(obj);
        setEditing(true);
    }

    const searchObject = (searchValue) => {
        setSearchValue(searchValue);
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.flexwrapper} style={{gap: 0, textAlign: 'center'}}>
                <ItemCard width='150px' type='Recycle Bin' selected={listType === 'Bins'} onClick={setListType} />
            </div>
            <div className={classes.flexwrapper}>
                <DashHomePage bins={recycleBins}
                 searchValue={searchValue}
                    delete={deleteObject} edit={editObject} editObject={currentObject._id ?? ''}
                    search={searchObject}
                      />
                <DashFormPage currentObject={currentObject} editing={editing}
                    add={addObject} cancel={cancelEdit} save={saveObject} />
            </div>
        </div>
    )
}

export default AdminDashboard;