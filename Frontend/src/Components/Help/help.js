import React from 'react';
import './help.css';
import { Link } from 'react-router-dom';

function HelpAndSupport() {
  return (
    <div className='help'>
      <div className="button-container">
        {/* Button for the issue with start/stop recycling */}
        <button className="rounded-button">
          <span>Issue with start/stop recycling</span>
        </button>
        {/* Link to the report page for reporting and complaints */}
        <Link to="/report" >
          <button className="rounded-button">
            <span>Reporting & Complaints</span>
          </button>
        </Link>
        {/* Button for FAQs */}
        <button className="rounded-button">
          <span>FAQs</span>
        </button>
        {/* Button for illegal recycling */}
        <button className="rounded-button">
          <span>Illegal Recycling</span>
        </button>
      </div>
    </div>
  );
}

export default HelpAndSupport;
