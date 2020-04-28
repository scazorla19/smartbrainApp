import React from 'react';
import Tilt from 'react-tilt';
import smartbrain from './smartbrain.png';

const Logo = () => {
  return (
    <div className='ma4 mt0 center'>
      <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 125, width: 125 }} >
        <div className="Tilt-inner pa2">
          <img style={{paddingTop: '5px'}} alt='logo' src={smartbrain} />
        </div>
      </Tilt>
    </div>
  );
}

export default Logo;