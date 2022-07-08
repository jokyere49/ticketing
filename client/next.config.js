// we are telling next to pull in changes every 300ms
module.exports ={
    webpackDevMiddleware: config =>{
        config.watchOptions.poll = 300;
        return config;
    }
};