'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js'
//import userRoutes from '../src/user/';
import authRoutes from '../src/auth/auth.routes.js'

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.authPath = '/gestorHoteles/v1/auth';

        this.conectarDB();
        this.middlewares();
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(express.static('public'));
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes(){
        this.app.use(this.authPath, authRoutes);

    }
    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Server running and listening to port', this.port)
        })
    }
}

export default Server;