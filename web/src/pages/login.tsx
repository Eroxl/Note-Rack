import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import Router from 'next/router';
import Link from 'next/link';

import LoginInputField from '../components/login/LoginInputField';

const LoginPage = () => {
  const [isOnLoginPage, setIsOnLoginPage] = useState(true);
  const [error, setError] = useState('');

  const Login = async (
    accountDetails: {username: string | undefined, email: string, password: string},
  ) => {
    const { email, password } = accountDetails;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
      credentials: 'include',
    });

    const responseJSON = await response.json();

    if (responseJSON.status === 'error') {
      setError(responseJSON.message);
    } else {
      Router.push('/note-rack/');
    }
  };

  const Signup = async (
    accountDetails: {username: string | undefined, email: string, password: string},
  ) => {
    const { username, email, password } = accountDetails;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
      credentials: 'include',
    });

    const responseJSON = await response.json();

    if (responseJSON.status === 'error') {
      setError(responseJSON.message);
    } else {
      Router.push('/note-rack/');
    }
  };

  return (
    <div className="w-screen h-screen bg-amber-50">
      <div className="h-full mx-auto max-w-7xl">
        {/* Top Bar */}
        <div className="grid w-full h-20 grid-flow-col px-4 pt-2 border-b-2 border-zinc-700 text-zinc-700">
          <Link href="/#">
            <a href="/#" className="flex flex-row my-auto text-3xl font-semibold align-center">
              <i className="emoji text-5xl bg-[url('https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@13.1.0/color/svg/1F4DD.svg')]" />
              <h1 className="my-auto">Note Rack</h1>
            </a>
          </Link>
        </div>
      </div>
      {/* Login / Signup Page */}
      <div className="absolute flex flex-col justify-center align-middle -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute -translate-x-full fill-red-400 -z-10 md:-translate-x-96">
          <path d="M30.8,-47.3C43.4,-46.1,59.5,-44.9,64.7,-37C69.9,-29.1,64.2,-14.6,59.9,-2.5C55.6,9.6,52.7,19.2,50.5,32.2C48.3,45.3,46.8,61.8,38.5,70.1C30.2,78.4,15.1,78.4,1.8,75.3C-11.5,72.2,-23,66,-29.6,56.8C-36.2,47.5,-37.8,35.1,-46.9,25.2C-55.9,15.2,-72.3,7.6,-74.6,-1.4C-77,-10.4,-65.4,-20.7,-57.4,-32.4C-49.4,-44.1,-44.9,-57.1,-36,-60.4C-27,-63.7,-13.5,-57.3,-2.2,-53.5C9.1,-49.7,18.2,-48.5,30.8,-47.3Z" transform="translate(100 100)" />
        </svg>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute translate-x-full fill-red-400 -z-10 md:translate-x-96">
          <path d="M24,-46.7C32.7,-36.5,42.5,-33.3,46.4,-26.7C50.2,-20.1,48.1,-10.1,51,1.7C53.9,13.4,61.7,26.8,61.4,39.5C61,52.2,52.5,64.2,40.9,66.5C29.4,68.7,14.7,61.1,1.5,58.5C-11.7,56,-23.4,58.3,-34.3,55.7C-45.3,53.1,-55.6,45.6,-65.5,35.5C-75.3,25.4,-84.7,12.7,-83.5,0.7C-82.3,-11.3,-70.5,-22.6,-62.6,-36.2C-54.8,-49.8,-50.9,-65.7,-41.2,-75.3C-31.4,-84.9,-15.7,-88.3,-4,-81.3C7.6,-74.3,15.2,-56.9,24,-46.7Z" transform="translate(100 100)" />
        </svg>

        <Formik
          initialValues={isOnLoginPage ? { username: undefined, email: '', password: '' } : { username: '', email: '', password: '' }}
          onSubmit={isOnLoginPage ? Login : Signup}
          enableReinitialize
        >
          <Form className="flex flex-col items-center justify-center md:w-96 w-60">
            <div className="flex flex-col items-center justify-around w-full gap-4 mb-8 h-max md:flex-row md:gap-10 text-zinc-700">
              <button className={`text-5xl font-semibold ${isOnLoginPage && 'cursor-default'}`} type="button" onClick={() => { setIsOnLoginPage(true); setError(''); }}>
                Login
                <div className={`${isOnLoginPage && 'bg-red-400'} h-2 w-full rounded-full transition-opacity`} />
              </button>
              <button className={`text-5xl font-semibold ${!isOnLoginPage && 'cursor-default'}`} type="button" onClick={() => { setIsOnLoginPage(false); setError(''); }}>
                Sign Up
                <div className={`${!isOnLoginPage && 'bg-red-400'} h-2 w-full rounded-full transition-opacity`} />
              </button>
            </div>

            {!isOnLoginPage && (
              <LoginInputField type="text" label="Username" />
            )}
            <LoginInputField type="email" label="Email" />
            <LoginInputField type="password" label="Password" />
            {error !== '' && (
              <h1 className="w-4/5 text-red-400">{`* ${error}`}</h1>
            )}
            <button type="submit" className="w-32 px-5 py-2 mt-5 text-xl font-semibold bg-red-400 border-2 rounded-sm shadow text-amber-50 border-zinc-700">{isOnLoginPage ? 'Log in' : 'Sign up'}</button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
