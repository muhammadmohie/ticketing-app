import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {

    return currentUser?
    <div className='flex justify-center text-2xl p-10 my-10 text-green-800'>
        <div className='w-2/3 p-20 border-2 rounded-3xl border-green-400'>
            <h1 className='text-center my-10 font-bold text-5xl'>Created tickets</h1>
            <table className='w-full'>
                <thead className="border-b-2 border-t-2 border-green-400">
                <tr>
                    <th className="px-6 py-2 text-2xl text-center font-semibold">Title</th>
                    <th className="px-6 py-2 text-2xl text-center font-semibold">Price</th>
                    <th className="px-6 py-2 text-2xl text-center font-semibold">Link</th>
                </tr>
                </thead>
                <tbody>
                {
                    tickets.map((ticket) => {
                        return (
                        <tr key={ticket.id} className= "border-b-2 border-green-200">
                            <td className="px-6 py-4 text-lg text-center">{ticket.title}</td>
                            <td className="px-6 py-4 text-lg text-center">{ticket.price}</td>
                            <td className="px-6 py-4 text-lg text-center">
                                <Link href='/tickets/[ticketId]'
                                    as={`/tickets/${ticket.id}`}>
                                        <a>View</a>
                                </Link></td>
                        </tr>
                        );
                    })
                }</tbody>
            </table>
        </div>
    </div>
    : <h1 className='text-center font-bold text-4xl p-10 m-20 text-green-800'>You are not signed in</h1>;
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/tickets');
    
    return { tickets: data};
};

export default LandingPage;
