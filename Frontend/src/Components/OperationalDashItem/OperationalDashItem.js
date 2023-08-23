import React from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';
import './OperationalDashItem.css';

export default function DashItem(props) {
    function edit() {
        props.edit( {
                _id: props._id,
                location: props.location,
                maxCapacity: props.maxCapacity,
                plasticCurrentCapacity: props.capacity.plastic,
                canCurrentCapacity: props.capacity.can,
                glassCurrentCapacity: props.capacity.glass,
                status:props.status
            });
    }
    const focused = props.editing ? { outline: "2px #189A46 solid" } : {};
    return (
        <div className='dash-card' style={focused}>
            {
                <>
                    <div className='dash-content'>
                        <img
                            className='dash-img'
                            src={require(`../../Images/icons/other-bin.png`)}
                            alt="other"
                        />
                        <span className='overflow-text' title={props.customId}>
                            <b>id:</b> {props.customId}
                        </span>
                        <span className='overflow-text' title={props.location.lat}>
                            <b>Latitude:</b> {props.location.lat}
                        </span>
                        <span className='overflow-text' title={props.location.lng}>
                            <b>Longitude:</b> {props.location.lng}
                        </span>
                        <span className='overflow-text' title={props.status}>
                            <b>Status:</b> {props.status}
                        </span>
                        <span className='overflow-text' title={props.maxCapacity}>
                            <b>Max Capacity:</b> {props.maxCapacity}
                        </span>
                        <span className='overflow-text' title={ props.capacity.plastic}>
                            <b>Plastic Capacity:</b> { props.capacity.plastic}
                        </span>
                        <span className='overflow-text' title={ props.capacity.can}>
                            <b>Can Capacity:</b> { props.capacity.can}
                        </span>
                        <span className='overflow-text' title={ props.capacity.glass}>
                            <b>Glass Capacity:</b> {  props.capacity.glass}
                        </span>
                    </div>
                </>
            }
            <div className='dash-tool-box'>
                <button className='dash-tool btn-round' onClick={edit}><FaPen /></button>
                <button className='dash-tool btn-round' onClick={() => props.delete(props.index)}><FaTrash /></button>
            </div>
        </div >
    );
}