import React from 'react';

const Icon = (props: { icon: string }) => {
  const { icon } = props;

  return (<h1 className="text-7xl select-none -ml-10">{icon}</h1>);
};

export default Icon;
