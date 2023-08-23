import React from 'react';
import DashList from '../DashList/DashList';
import classes from './DashHomePage.module.css';

export default function DashHomePage(props) {
    // Render the DashList component and pass the necessary props
    return (
        <div className={classes.wrapper}>
            <DashList recyclerUsers={props.recyclerUsers} municipalUsers={props.municipalUsers} searchValue={props.searchValue}
                delete={props.delete} edit={props.edit} editObject={props.editObject} isMunicipal={props.isMunicipal} />
        </div>
    )
}