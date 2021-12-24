import Router from 'next/router';
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [secondsLeft, setSecondsLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const millisLeft = new Date(order.expiresAt) - new Date();
      setSecondsLeft(Math.round(millisLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (secondsLeft < 0) {
    return(<div className='flex text-center justify-center text-2xl p-10 my-10 text-green-800'>Order expired</div>)
  }

  return (
  <div className='flex justify-center text-2xl p-10 my-10 text-green-800'>
    <div className='w-2/3 p-20 border-2 rounded-3xl border-green-400 align-center justify-center'>
      <div className='text-center'>Time left to pay is: {secondsLeft} seconds</div>
      <div className='flex justify-center'>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id})}
        className='w-1/3 mt-10'
        stripeKey='pk_test_51K9coBE0iPUH1rrhXVJnydK9xOv6mXE14JlnDA6yDl3mceAgFwyFuRvzbsgkMfi37ANpW1VCROo3K3OmMNsKCaEo00T7FhHi9r'
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      </div>
          {
              errors.map(error => {
                  return ( error[1] );
              })
          }
    </div>;
  </div>
  )
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
