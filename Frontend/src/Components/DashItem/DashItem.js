import React from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';
import './DashItem.css';

export default function DashItem(props) {
     // Function to handle the edit action
    function edit(item) {
    // Call the edit function from props and pass the item data
        props.edit(props.isMunicipal ?
            {
                _id: item._id,
                name: item.name,
                email: item.email,
                imgUrl: item.imgUrl,
                password: item.password,
                userType: item.userType,
                city: item.city,
                lat: item.lat,
                lng: item.lng,
            } : {
                _id: item._id,
                name: item.name,
                email: item.email,
                age: item.age,
                gender: item.gender,
                imgUrl: item.imgUrl,
                wallet: item.wallet,
            });

    }

    return (
        <div className='containerTable'>
            <table className='Mytable'>
                {/* Render the table only if it's for municipal users */}
                {props.isMunicipal ?
                    <>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>municipal type</th>
                                <th>city</th>
                                <th>Email</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.municipalUsers.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.name}</td>
                                    <td> {item.userType.operationalManager ? 'Operational Manager' : 'Municipality Analytics'}</td>
                                    <td>{item.city}</td>
                                    <td>{item.email}</td>
                                    {/* Render the edit button and bind the edit function to its click event */}
                                    <td><button className='dash-tool btn-round' onClick={() => edit(item)}><FaPen /></button></td>
                                      {/* Render the delete button and bind the delete function from props to its click event */}
                                    <td><button className='dash-tool btn-round' onClick={() => props.delete(item._id)}><FaTrash /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </>
                    : <></>}
            </table>
        </div>
    );
}