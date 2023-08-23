import React from 'react';
import DashItem from '../OperationalDashItem/OperationalDashItem';
import classes from './OperationalDashList.module.css';

export default function DashList(props) {
  // Function to render each item in the list
  function eachItem(item, i) {
    const editing = item._id === props.editObject ? { editing: true } : {};
    return (
      <DashItem
        key={i}
        index={item._id}
        delete={props.delete}
        edit={props.edit}
        {...item}
        {...editing}
        customId={item.customId}
      />
    );
  }

  let items = props.bins;
  // Assign a customId to each item for rendering purposes
  // eslint-disable-next-line array-callback-return
  items.map((item, i) => {
    item.customId = i;
  });

  // Filter the items based on the search value
  items = props.searchValue
    ? items.filter(
        item =>
          item.status.toLowerCase() === props.searchValue.toLowerCase() ||
          item.customId === Number(props.searchValue)
      )
    : items;

  return (
    <div className={classes.list}>
      {(items && items.length > 0) ? items.map(eachItem) : "There's no items to show."}
    </div>
  );
}
