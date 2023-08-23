import React from 'react';
import DashItem from '../DashItem/DashItem'
import classes from './DashList.module.css'
import UserTable from '../UsersTable/UserTable';

export default function DashList(props) {
  // Function to render each item for recycler users
  function eachItemRecycle() {
    return <UserTable recyclerUsers={props.recyclerUsers} delete={props.delete} />
  }

  // Function to render each item for municipal users
  function eachItemMunicipal() {
    return (
      <DashItem municipalUsers={props.municipalUsers} edit={props.edit} delete={props.delete} isMunicipal={props.isMunicipal} />
    );
  }

  // Determine the items based on whether it's for municipal or recycler users
  let items = props.isMunicipal ? props.municipalUsers : props.recyclerUsers;

  // Filter the items based on the search value
  items = props.searchValue ?
    items.filter(
      item =>
        (props.isMunicipal && item.name.toLowerCase().includes(props.searchValue.toLowerCase())) ||
        (!props.isMunicipal && item.type.toLowerCase().includes(props.searchValue.toLowerCase())) ||
        (item._id === props.searchValue)
    ) :
    items;

  return (
    <div className={classes.list}>
      {/* Render the appropriate component based on whether it's for municipal or recycler users */}
      {props.isMunicipal ?
        (items && items.length > 0) ? eachItemMunicipal() : "There's no items to show." :
        (items && items.length > 0) ? eachItemRecycle() : "There's no Recycles to show."
      }
    </div>
  )
}
