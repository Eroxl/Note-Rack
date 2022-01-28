import React from 'react';

const Icon = (props: { icon: string }) => {
  const { icon } = props;

  return (<span role="img" className="text-7xl select-none">{icon}</span>);
};

export default Icon;
