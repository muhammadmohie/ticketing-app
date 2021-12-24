import { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request';

export default () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async event => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <div className='flex justify-center text-2xl p-10 my-10 text-green-800'>
      <form onSubmit={onSubmit} className='w-1/2 p-20 border-2 rounded-3xl border-green-400' >
        <h1 className='w-full text-center text-7xl font-bold mb-10'>Sign in</h1>
        <div>
          <label className='block mb-5 font-semibold text-green-800'>Email Address</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='block py-5 h-20 px-5 w-full rounded-lg border-2 border-green-300'
            placeholder='Enter your email'
          />
          {
            errors.map(error => {
              if (error[0] === 'email') {
                return ( error[1] );
              }
            })
          }
        </div>
        <div className='my-5'>
          <label className='block mt-10 mb-5 font-semibold text-green-800'>Password</label>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            className='block py-5 h-20 px-5 w-full rounded-lg border-2 border-green-300'
            placeholder='Enter your password'
          />
        </div>
          {
            errors.map(error => {
              if (error[0] === 'password') {
                return ( error[1] );
              } else if (error[0] !== 'email') {
                return ( error[1] );
              }
            })
          }
        <button className='block w-full h-20 font-semibold mx-auto mt-20 p-4 bg-green-600 hover:bg-green-500 rounded-lg text-white'>Sign in</button>
      </form>
    </div>
  );
};