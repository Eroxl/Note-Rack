import React from 'react';

import '../../styles/index.css';
import SubAndSubAndSuperScript from '../SubSupScript/SubAndSuperScript';

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
      <SubAndSubAndSuperScript
        superScript={to}
        subScript={from}
      />
    </span>
  );
};

export default Integral;
