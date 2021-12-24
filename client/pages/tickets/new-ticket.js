import { useState } from 'react'
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewTicket = () => {
  const [title, setTitle] =useState('');
  const [price, setPrice] =useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  }

  return (
    <div className='flex justify-center text-2xl p-10 my-10 text-green-800'>
      <form onSubmit={onSubmit} className='w-2/3 p-20 border-2 rounded-3xl border-green-400' >
        <h1 className='w-full text-center text-5xl font-bold mb-10'>Create a new ticket</h1>
        <div>
          <label className='block mb-5 font-semibold text-green-800'>Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className='block py-5 h-20 px-5 w-full rounded-lg border-2 border-green-300'
            placeholder='Enter ticket title'
          />
        </div>
            {
              errors.map(error => {
                if (error[0] === 'title') {
                  return ( error[1] );
                }
              })
            }
        <div className='my-5'>
          <label className='block mt-10 mb-5 font-semibold text-green-800'>Price</label>
          <input
            value={price}
            onChange={e => setPrice(e.target.value)}
            onBlur={onBlur}
            className='block py-5 h-20 px-5 w-full rounded-lg border-2 border-green-300'
            placeholder='Enter ticket price'
          />
        </div>
            {
              errors.map(error => {
                if (error[0] === 'price') {
                  return ( error[1] );
                } else if (error[0] !== 'title') {
                  return ( error[1] );
                }
              })
            }
        <button className='block w-full h-20 font-semibold mx-auto mt-20 p-4 bg-green-600 hover:bg-green-500 rounded-lg text-white'>Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
