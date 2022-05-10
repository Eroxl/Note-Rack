import React from 'react';

import '../../styles/index.css';
import SubScript from '../SubSupScript/SubScript';
import SuperScript from '../SubSupScript/SuperScript';

interface IntegralProps {
  from: string,
  to: string,
}

const Integral: React.FC<IntegralProps> = (props) => {
  const { from, to } = props;

  return (
    <span>
      <span
        className="symbola"
        style={{
          fontSize: '1.5em',
          fontWeight: 'lighter',
        }}
      >
        ∫
      </span>
      <span
        className="math"
        style={{
          display: 'inline-block',
          position: 'relative',
          verticalAlign: '-0.5em',
        }}
      >
        <SuperScript style={{ display: 'block', marginLeft: '0.15em' }}>
          {to}
        </SuperScript>
        <SubScript style={{ display: 'block', marginLeft: '-0.2em' }}>
          {from}
        </SubScript>
      </span>
    </span>
  );
};

export default Integral;
