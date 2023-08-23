import React from 'react';
import classes from './ItemCard.module.css';

function ItemCard(props) {
    const handleClick = () => {
        if (props.onClick) {
            props.onClick(props.type);
        }
    }
    return (
        <div onClick={handleClick}
            className={classes.container}
            style={{
                width: props.width ?? '70px',
                height: props.height ?? '82px',
                background: props.selected ? '#189A46' : '#F0F4F3',
            }}>
            {props.icon ?
                <img src={props.icon}
                    className={classes.img}
                    style={{
                        filter: props.selected ? 'brightness(0) invert(1)' : '',
                    }} /> :
                <></>}
            <span className={classes.span}
                style={{
                    color: props.selected ? 'white' : '#708F85',
                }}>{props.type}</span>
        </div>
    )
}

export default ItemCard;