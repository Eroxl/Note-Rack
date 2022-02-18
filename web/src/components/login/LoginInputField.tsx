import React from 'react';
import { Field } from 'formik';

const LoginInputField = (props: { label: string, type: string }) => {
  const { label, type } = props;

  return (
    <div className="flex flex-col justify-center w-full mb-1 md:w-4/5">
      <h1 className="text-zinc-700 opacity-70">{label}</h1>
      <Field name={label.toLowerCase()} type={type} className="w-full px-2 py-2 text-xl border-2 rounded-sm shadow bg-amber-50 text-zinc-700 border-zinc-700 focus:outline-green-400 focus:outline-2 focus:outline" required />
    </div>
  );
};

export default LoginInputField;
