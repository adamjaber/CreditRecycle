import React from 'react';
import { RiCopperCoinLine } from 'react-icons/ri';
import { FaTrash } from 'react-icons/fa';
import './UserTable.module.css';

function UserTable(props) {
  return (
    <table >
      <thead>
        <tr>
          <th>User Name</th>
          <th>Age</th>
          <th>Gender</th>
          <th>Wallet</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {/* Map over the 'recyclerUsers' array passed as a prop */}
        {props.recyclerUsers.map((item) => (
          <tr key={item._id}>
            <td>{item.name}</td>
            <td>{item.age}</td>
            <td>{item.gender}</td>
            <td>
              {/* Display the user's wallet */}
              <div className='user-wallets'>
                <RiCopperCoinLine className='wallet-icon' />
                <span> {item.wallet}</span>
              </div>
            </td>
             {/* Display a delete button and call the 'delete' function passed as a prop with the user's ID */}
            <td><button className='dash-tool btn-round' onClick={() => props.delete(item._id)}><FaTrash /></button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UserTable;
