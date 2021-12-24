import 'tailwindcss/tailwind.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent =  ({ Component, pageProps, currentUser }) => {
    return <div>
        <Header currentUser={currentUser} />
        <div className=''>
            <Component currentUser={currentUser} {...pageProps} />
        </div>
    </div>
};

AppComponent.getInitialProps = async (appContext) => {
    // appContext keys: appTree, Component, Router, ctx (context)
    const client = buildClient(appContext.ctx); // return axios instance
    const { data } = await client.get('/api/users/currentuser');
    
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
    }

    return {
        pageProps,
        ...data
    }
};

export default AppComponent;