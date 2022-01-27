import React from 'react';

const Page = (props: { icon: string, name: string }) => {
  const { icon, name } = props;

  return <button className="text-base opacity-100 font-bold w-max" type="button">{`[ ${icon} ${name} ]`}</button>;
};

export default Page;
