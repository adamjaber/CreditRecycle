import React, { useState, useEffect } from 'react';
import './TrashInformation.css';
import UtilService from '../../Services/util.service';

const green = 'rgba(13,121,9,1)';
const red = 'rgba(121,31,9,1)';
const yellow = 'rgba(121,92,9,1)';

function TrashInformation(props) {
    // State variables
    const [address, setAddress] = useState('');
    const [glassCapacity, setGlassCapacity] = useState('');
    const [plasticCapacity, setPlasticCapacity] = useState('');
    const [canCapacity, setCanCapacity] = useState('');

    // Function to fetch address based on latitude and longitude
    const getAddress = async (lat, lng) => {
        const result = await UtilService.fetchAddress(lat, lng);
        setAddress(result);
    }

    useEffect(() => {
        // Fetch the address and set capacity percentages when the props change
        getAddress(props.bin.location.lat, props.bin.location.lng);
        setGlassCapacity(parseInt((props.bin.capacity.plastic / props.bin.maxCapacity) * 100));
        setPlasticCapacity(parseInt((props.bin.capacity.glass / props.bin.maxCapacity) * 100));
        setCanCapacity(parseInt((props.bin.capacity.can / props.bin.maxCapacity) * 100));
    }, [props]);

    // Function to set the destination for navigation
    const setDestination = () => {
        if (props.onNav)
            props.onNav(props.bin?.location?.lat, props.bin?.location?.lng);
    }



    return (
        <div className='trash-information'>
            <h5 className='address'>{address}</h5>
            <div className='container'>
                <div>
                    <span className='trash-icon-glass'></span>
                    <h5 className="my-heading">glass</h5>
                    <div className='trash-container'
                        style={{
                            background: `linear-gradient(0deg,  ${glassCapacity >= 80 ? red : glassCapacity >= 50 ? yellow : green}
                    0%, rgba(255,255,255,1)  ${glassCapacity}%)`
                        }}>
                        <div className='trash-hr-line-plastic'
                            style={{
                                bottom: `${glassCapacity}%`
                            }}
                        ></div>
                        <h5 className='trash-capacity'>{glassCapacity}%</h5>
                    </div>
                </div>
                <div>
                    <span className='trash-icon-plastic' />
                    <h5 className="my-heading">plastic</h5>
                    <div className='trash-container'
                        style={{
                            background: `linear-gradient(0deg,  ${plasticCapacity >= 80 ? red : plasticCapacity >= 50 ? yellow : green}
                    0%, rgba(255,255,255,1)  ${plasticCapacity}%)`
                        }}>
                        <div className='trash-hr-line-glass'
                            style={{
                                bottom: `${plasticCapacity}%`
                            }}
                        ></div>
                        <h5 className='trash-capacity'>{plasticCapacity}%</h5>
                    </div>

                </div>
                <div>
                    <span className='trash-icon-can' />
                    <h5 className="my-heading">can</h5>
                    <div className='trash-container'
                        style={{
                            background: `linear-gradient(0deg,  ${canCapacity >= 80 ? red : canCapacity >= 50 ? yellow : green}
                    0%, rgba(255,255,255,1)  ${canCapacity}%)`
                        }}>
                        <div className='trash-hr-line-can'
                            style={{
                                bottom: `${canCapacity}%`
                            }}
                        ></div>
                        <h5 className='trash-capacity'>{canCapacity}%</h5>
                    </div>
                </div>
            </div>

            <button className='trash-navigation-button' onClick={setDestination}>Route to Bin</button>

        </div>

    );


}

export default TrashInformation;




