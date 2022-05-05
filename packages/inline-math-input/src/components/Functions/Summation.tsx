import React from 'react';

import '../../styles/index.css';
import SubAndSubAndSuperScript from '../SubSupScript/SubAndSuperScript';

interface IntegralProps {
  limit: string,
  index: string,
}

const Integral: React.FC<IntegralProps> = (props) => {
  const { limit, index } = props;

  return (
    <span
      className="math"
      style={{
        position: 'relative',
      }}
    >
      <span
        className="symbola"
        style={{
          fontSize: '1.5em',
          fontWeight: 'lighter',
        }}
      >
        ∑
      </span>
      <span
        style={{
          position: 'absolute',
          top: '-100%',
          textAlign: 'center',
          left: '0px',
          width: '100%',
          fontSize: '0.8em',
        }}
      >
        {limit}
      </span>
      <span
        style={{
          position: 'absolute',
          bottom: '-100%',
          textAlign: 'center',
          left: '0px',
          width: '100%',
          fontSize: '0.8em',
        }}
      >
        {index}
      </span>
    </span>
  );
};

export default Integral;
