import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import { Map } from '../Map';
import QrScanner from '../QRScanner/qrScanner';
import Recycle from '../Recycle/Recycle';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import Settings from '../Settings/settings';
import History from '../History/history';
import HeaderPage from '../HeaderPages/headerpage';
import AdminDashboard from '../AdminDashboard/AdminDashboard'
import Help from '../Help/help';
import EditProfile from '../EditProfile/EditProfile';
import Report from '../Report/report';
import Municipal from '../Municipal/municipal';
import OperationalDashboard from '../OperationalDashboard/OperationalDashboard';

function App() {
  
  return ( 
    <div className="App">

      <BrowserRouter>
        <ReactRouter path="/" HeaderPage>
          <>
            <Map />
            <Link id='recycling-button' to='/recycle' />
          </>
        </ReactRouter>
        <ReactRouter path="/qrscanner" HeaderPage title={'Qr Scanner'} prev>
          <QrScanner />
        </ReactRouter>
        <ReactRouter path="/recycle" HeaderPage title={'Recycle'} prev>
          <Recycle />
        </ReactRouter>
        <ReactRouter path="/login" >
          <Login />
        </ReactRouter>
        <ReactRouter path="/help" HeaderPage title={'Help&support'} prev >
          <Help />
        </ReactRouter>
        <ReactRouter path="/EditProfile" HeaderPage title={'Edit Profile'} prev >
          <EditProfile />
        </ReactRouter>
        <ReactRouter path="/settings" HeaderPage title={'Settings'} prev>
          <Settings />
        </ReactRouter>
        <ReactRouter path="/signup" >
          <Signup />
        </ReactRouter>
        <ReactRouter path="/history" HeaderPage title={'History'} prev>
          <History />
        </ReactRouter>
        <ReactRouter path="/report" HeaderPage title={'Report'} prev >
          <Report />
        </ReactRouter>
        <ReactRouter path="/admindashboard" HeaderPage title={'Admin Dashboard'} prev>
          <AdminDashboard />
        </ReactRouter>
        <ReactRouter path="/operationaldashboard" HeaderPage title={'Operational Dashboard'} prev>
          <OperationalDashboard />
        </ReactRouter>
        <ReactRouter path="/municipal" HeaderPage title={'Municipal Dashboard'} prev >
          <Municipal />
        </ReactRouter>
      </BrowserRouter>

    </div>
  );
}

// Custom wrapper component for React Router
function ReactRouter(props) {
  return (
    <Routes>
      <Route exact path={props.path} element={
        <>
          {/* Render the header page if specified */}
          {props.HeaderPage ? <HeaderPage className='show-hide-header' title={props.title} prev={props.prev} /> : ''}
          {props.children}
        </>
      } />
    </Routes>
  )
}

export default App;
