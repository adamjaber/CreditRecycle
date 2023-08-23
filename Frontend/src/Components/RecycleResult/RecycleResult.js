import React, { useState, useEffect } from 'react';
import { TiArrowBack } from 'react-icons/ti';
import { BiCheckCircle } from 'react-icons/bi';
import success from '../../Images/success-trash.svg'
import classes from './RecycleResult.module.css';
import { Link } from 'react-router-dom';

function RecycleResult(props) {

    return (
        <div className={classes.container}>
            <img src={success} className={classes.img} />
            {props.proccessing ? ( // Show processing message if the recycling process is still ongoing
                <h3>Proccessing Please Wait...</h3>
            ) : ( // Show success message and points earned if the recycling process is completed
                <>
                    <div className={classes.flexbox}>
                        <h3>
                            Successful Recycle!
                        </h3>
                        <span className={classes.earned}>
                            <BiCheckCircle style={{ verticalAlign: 'middle' }} /> Points Earned
                        </span>
                        <span className={classes.points}>
                            +{props.points} Points
                        </span>
                    </div>
                    <TiArrowBack size={40} />
                    <Link to='/' className={classes.home}>Back to home</Link>
                </>
            )}
        </div>
    )
}

export default RecycleResult;
