import React from 'react';

const Title = (props: { titleString: string }) => {
  const { titleString } = props;

  return (<h1 className="text-5xl font-bold">{titleString}</h1>);
};

export default Title;
