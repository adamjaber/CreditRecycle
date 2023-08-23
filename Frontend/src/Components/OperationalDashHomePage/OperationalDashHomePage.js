import React from 'react';
import DashList from '../OperationalDashList/OperationalDashList';
import SearchBar from '../SearchBar/SearchBar';
import classes from  './OperationalDashHomePage.module.css';

export default function DashHomePage(props) {
    return (
        <div className={classes.wrapper}>
            <SearchBar search={props.search} />
            <DashList bins={props.bins} 
            searchValue={props.searchValue}
            delete={props.delete} edit={props.edit} editObject={props.editObject}
             />
        </div>
    )
}