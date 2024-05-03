'use strict'

import bcryptjs from 'bcryptjs';
import User from '../src/user/user.model.js'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js'
import userRoutes from '../src/user/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import hotelRoutes from '../src/hotel/hotel.routes.js';
import roomRoutes from '../src/room/room.routes.js';

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.authPath = '/gestorHoteles/v1/auth';
        this.userPath = '/gestorHoteles/v1/user';
        this.hotelPath = '/gestorHoteles/v1/hotel';
        this.roomPath = '/gestorHoteles/v1/room';

        this.conectarDB();
        this.middlewares();
        this.routes();
    }

    async conectarDB(){
        await dbConnection();

        const lengthUsers = await User.countDocuments()
        if (lengthUsers > 0 ) return;

        const salt = bcryptjs.genSaltSync();
        const password = bcryptjs.hashSync('123456', salt);

        const adminUser = new User(
            { nombre: "Alejandro", correo: "admin@gmail.com", password, role: "ADMIN_ROLE_PLAT" }
        )
        adminUser.save()
    }

    middlewares(){
        this.app.use(express.static('public'));
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes(){
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.userPath, userRoutes);
        this.app.use(this.hotelPath, hotelRoutes);
        this.app.use(this.roomPath, roomRoutes);
    }
    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Server running and listening to port', this.port)
        })
    }
}

export default Server;