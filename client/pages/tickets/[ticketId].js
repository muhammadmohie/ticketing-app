import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div className='flex justify-center text-2xl p-10 my-10 text-green-800'>
      <div className='w-2/3 p-20 border-2 rounded-3xl border-green-400'>
        <h1 className='text-center my-10 font-bold text-4xl'>{ticket.title}</h1>
        <h4 className='text-center my-10 font-medium text-4xl'>Price: {ticket.price}</h4>
        {errors}
        <div className='w-full flex justify-center'>
          <button onClick={ () => doRequest()}
            className='w-1/2 h-20 font-semibold mx-auto mt-10 p-4 bg-green-600 hover:bg-green-500 rounded-lg text-white'
          >
            Purchase
          </button>
          {
              errors.map(error => {
                  return ( error[1] );
              })
          }
        </div>
      </div>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {

  const { ticketId } = context.query; // Extract ticketId from the url

  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
