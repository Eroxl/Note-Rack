import React from 'react';
import { Field } from 'formik';

const LoginInputField = (props: { label: string, type: string }) => {
  const { label, type } = props;

  return (
    <div className="flex flex-col justify-center mb-1 md:w-4/5 w-full">
      <h1 className="text-zinc-700 opacity-70">{label}</h1>
      <Field name={label.toLowerCase()} type={type} className="w-full bg-amber-50 text-zinc-700 rounded-sm text-xl px-2 py-2 border-zinc-700 border-2 shadow focus:outline-green-400 focus:outline-2 focus:outline" />
    </div>
  );
};

export default LoginInputField;
