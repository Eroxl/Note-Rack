import React from 'react';

interface RootProps {
  degree?: React.ReactNode[] | React.ReactNode | undefined,
  children?: React.ReactNode[] | React.ReactNode | undefined,
}

const Root = (props: RootProps) => {
  const { degree, children } = props;

  return (
    <span
      style={{
        position: 'relative',
      }}
    >
      √
      <span
        style={{
          height: '100%',
          borderTop: '0.04em',
          borderTopStyle: 'solid',
          marginLeft: '-0.04em',
        }}
      >
        <span
          style={{
            fontSize: '0.8em',
            marginLeft: '0.04em',
          }}
        >
          {children}
        </span>
      </span>
      <div
        style={{
          position: 'absolute',
          left: '0.2em',
          top: '-25%',
          fontSize: '0.5em',
        }}
      >
        {degree}
      </div>
    </span>
  );
};

export default Root;
