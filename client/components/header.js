import Link from 'next/link';

export default ({ currentUser }) => {
    const links = [
        !currentUser && {label: 'Sign Up', href: '/auth/signup'},
        !currentUser && {label: 'Sign In', href: '/auth/signin'},
        currentUser && {label: 'My orders', href: '/orders'},
        currentUser && {label: 'Sell tickets', href: '/tickets/new-ticket'},
        currentUser && {label: 'Sign Out', href: '/auth/signout'}
    ]
    .filter(linkConfig => linkConfig)
    .map(({ label, href }) => {
        return (
            <li key={href}>
              <Link href={href} >
                <a className="py-3 px-12 bg-white rounded-xl hover:bg-green-100">{label}</a>
              </Link>
            </li>
          );
    });


    return (
        <nav className="flex h-20 py-5 px-10 items-center justify-between font-bold text-green-800 w-full bg-green-800">
          <Link href="/" className="w-1/4">
            <a className="text-white text-3xl">Ticketing App</a>
          </Link>
    
            <ul className="w-3/4 flex justify-evenly">
              {links}
            </ul>
        </nav>
      );
};