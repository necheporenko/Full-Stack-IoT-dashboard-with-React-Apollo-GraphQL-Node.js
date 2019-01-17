import React from 'react';

const Popup = ({ children, closePopup, savePopup, title }) => (
  <div className="popup">
    <div className="header">
      <div className="title">{title}</div>
      <div className="btn--close" onClick={closePopup}></div>
    </div>
    <div className="body">
      {children}
    </div>
    <div className="footer">
      <button className="btn--actions btn--actions--cancel" onClick={closePopup}>Cancel</button>
      <button className="btn--actions" onClick={savePopup}>Save</button>
    </div>
  </div>
)

export default Popup;