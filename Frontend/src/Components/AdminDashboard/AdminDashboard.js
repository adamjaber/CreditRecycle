import React, { useState, useEffect } from 'react';
import classes from './AdminDashboard.module.css';
import UserService from '../../Services/user.service';
import UtilService from '../../Services/util.service';
import DashFormPage from '../DashFormPage/DashFormPage';
import DashHomePage from '../DashHomePage/DashHomePage';
import ItemCard from '../ItemCard/ItemCard';
import AuthService from '../../Services/auth.service';
import { useNavigate } from 'react-router-dom';
function AdminDashboard(props) {

    const [municipalUsers, setMunicipalUsers] = useState([]); // State for municipal users
    const [recyclerUsers, setRecyclerUsers] = useState([]); // State for recycler users
    const [editing, setEditing] = useState(false); // State for editing mode
    const [searchValue, setSearchValue] = useState(''); // State for search value
    const [listType, setListType] = useState('Municipal'); // State for the type of list (Municipal or Recycler)
    const [currentObject, setCurrentObject] = useState({}); // State for the currently selected object
    const [user, setUser] = useState(null); // State for the current user
    const navigate = useNavigate(); // React Router navigate function

    // Function to initialize arrays
    const initArrays = async () => {
        try {
            let users;
            let cord;
            users = (await UserService.getUsers('?sort=wallet')).data;
            let localMunicipalUsers = (users.filter(user => (user.userType.operationalManager === true) || (user.userType.municipal === true)));
            let localRecyclerUsers = (users.filter(user => (user.userType.recycler === true)));
            await Promise.all(localMunicipalUsers.map(async localMunicipalUser => {
                cord = await UtilService.fetchCoordinates(localMunicipalUser.city);

                localMunicipalUser.lat = cord.split(',')[0];
                localMunicipalUser.lng = cord.split(',')[1];
            }));
            setMunicipalUsers(localMunicipalUsers);
            setRecyclerUsers(localRecyclerUsers);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        setUser(AuthService.getCurrentUser()); // Set the current user from AuthService
        initArrays(); // Initialize arrays
    }, []);

    // Redirect to homepage if the user is not an admin
    useEffect(() => {
        if (user && !(user.userType.admin)) {
            navigate('/');
        }
    }, [user]);

    // Function to add an object
    const addObject = async (obj) => {
        if (listType === 'Municipal') {
            if (currentObject) {
                try {
                    const address = (await UtilService.fetchAddress(obj.lat, obj.lng));
                    const city = address.split(',')[1];
                    const result = await UserService.addMunicipal(obj.name, obj.email, obj.password, obj.imgUrl, city, obj.userType);

                    setMunicipalUsers([...municipalUsers, result.data]);
                } catch (err) {
                    console.error(err);
                }
            }
        }
    };

    // Function to cancel editing
    const cancelEdit = () => {
        setCurrentObject({});
        setEditing(false);
    };

    useEffect(() => {
        cancelEdit(); // Cancel editing when the list type changes
    }, [listType]);

    // Function to save an object
    const saveObject = async (obj) => {
        if (listType === 'Municipal') {
            if (currentObject) {
                try {
                    const result = await UserService.updateMunicipal(obj._id, obj.name, obj.email, obj.password, obj.imgUrl, obj.city, obj.userType);
                    setMunicipalUsers(municipalUsers.map(municipalUser => municipalUser._id === obj._id ? obj : municipalUser));
                } catch (err) {
                    console.error(err);
                }
            }
        }

        setCurrentObject({});
        setEditing(false);
    }

    // Function to delete an object
    const deleteObject = async (id) => {
        if (listType === 'Municipal') {
            try {
                await UserService.deleteUser(id);
                setMunicipalUsers(municipalUsers.filter(municipalUser => municipalUser._id !== id));
            } catch (err) {
                console.error(err);
            }

        }
        else {
            try {
                await UserService.deleteUser(id);
                setRecyclerUsers(recyclerUsers.filter(recyclerUsers => recyclerUsers._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
        if (id === currentObject._id) {
            cancelEdit();
        }
    }

    //Function to edit an object
    const editObject = (obj) => {
        setCurrentObject(obj);
        setEditing(true);
    }

    const searchObject = (searchValue) => {
        setSearchValue(searchValue);
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.flexWrapper} style={{ gap: 0, textAlign: 'center' }}>
                <ItemCard width='150px' type='Recycler Users' selected={listType !== 'Municipal'} onClick={setListType} />
                <ItemCard width='150px' type='Municipal' selected={listType === 'Municipal'} onClick={setListType} />
            </div>
            <div className={classes.flexWrapperPage}>
                {/* Display the dashboard homepage */}
                <DashHomePage recyclerUsers={recyclerUsers} municipalUsers={municipalUsers} searchValue={searchValue}
                    delete={deleteObject} edit={editObject} editObject={currentObject._id ?? ''}
                    search={searchObject} isMunicipal={listType === 'Municipal'} />
                {/* Display the dashboard form page */}
                <DashFormPage currentObject={currentObject} editing={editing} isMunicipal={listType === 'Municipal'}
                    add={addObject} cancel={cancelEdit} save={saveObject} />
            </div>
        </div>
    )
}
export default AdminDashboard;