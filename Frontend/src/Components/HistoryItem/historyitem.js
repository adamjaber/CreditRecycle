import React from 'react';
import './historyitem.css'
function HistoryItem(props) {
    return (
        <div className='history-item'>
            <div className='history-title-date'>
                <h6>{props.date}</h6>
                <h5 className='overflow-text' title={props.address}>{props.address}</h5>
            </div>
            <div className='points'>
                <h6>Points (Earn)</h6>
                <h5>{props.points}</h5>
            </div>
        </div>
    );
}
export default HistoryItem;