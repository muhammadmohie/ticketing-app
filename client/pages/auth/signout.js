import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/auth/signin')
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (<h1 className='text-center font-bold text-4xl p-10 m-20 text-green-800'>You are now Signed you out.</h1>);
};