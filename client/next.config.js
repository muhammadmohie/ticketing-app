module.exports = {
    webpackDevMiddle: config => {
        config.watchOptions.poll = 300;
        return config;
    }
};