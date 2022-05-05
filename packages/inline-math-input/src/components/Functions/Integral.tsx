import React from 'react';

import SubAndSubAndSuperScript from '../SubSupScript/SubAndSuperScript';

interface IntegralProps {
  from: string,
  to: string,
}

const Integral: React.FC<IntegralProps> = (props) => {
  const { from, to } = props;

  return (
    <span>
      ∫
      <SubAndSubAndSuperScript
        superScript={to}
        subScript={from}
      />
    </span>
  );
};

export default Integral;
