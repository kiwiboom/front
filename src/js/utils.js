import axios from "axios";
import querystring from 'querystring'

const instance = axios.create({
    timeout: 5000
})

instance.interceptors.request.use(
    config =>{
        if(config.method === 'post'){
            config.data = querystring.stringify(config.data);
        }
        return config;
    },
    error =>{
        return Promise.reject(error);
    }
)