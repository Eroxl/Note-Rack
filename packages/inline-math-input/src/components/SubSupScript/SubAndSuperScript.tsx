import React from 'react';

import SubScript from './SubScript';
import SuperScript from './SuperScript';

interface SubAndSuperScriptProps {
  superScript?: string | undefined,
  subScript?: string | undefined,
  style?: React.CSSProperties | undefined,
}

const SubAndSubAndSuperScript: React.FC<SubAndSuperScriptProps> = (props) => {
  const { superScript, subScript, style } = props;

  if (subScript) {
    return (
      <span
        style={{
          display: 'inline-block',
          position: 'relative',
          verticalAlign: '-0.5em',
          ...style,
        }}
      >
        <SuperScript style={{ display: 'block' }}>
          {superScript}
        </SuperScript>
        <SubScript style={{ display: 'block' }}>
          {subScript}
        </SubScript>
      </span>
    );
  }

  return (
    <SuperScript>
      {superScript}
    </SuperScript>
  );
};

export default SubAndSubAndSuperScript;
