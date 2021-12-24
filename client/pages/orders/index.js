const OrderList = ({ orders }) => {
  return (

<div className='flex justify-center text-2xl p-10 my-10 text-green-800'>
<div className='w-2/3 p-20 border-2 rounded-3xl border-green-400'>
    <h1 className='text-center my-10 font-bold text-5xl'>Created orders</h1>
    <table className='w-full'>
        <thead className="border-b-2 border-t-2 border-green-400">
        <tr>
            <th className="px-6 py-2 text-2xl text-center font-semibold">Title</th>
            <th className="px-6 py-2 text-2xl text-center font-semibold">Status</th>
        </tr>
        </thead>
        <tbody>
        {
            orders.map((order) => {
                return (
                <tr key={order.id} className= "border-b-2 border-green-200">
                    <td className="px-6 py-4 text-lg text-center">{order.ticket.title}</td>
                    <td className="px-6 py-4 text-lg text-center">{order.status}</td>
                </tr>
                );
            })
        }</tbody>
    </table>
</div>
</div>


  );
};

OrderList.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');

  return { orders: data };
};

export default OrderList;
