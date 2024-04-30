'use strict'

import mongoose, { mongo } from "mongoose";

export const dbConnection = async async =>{
    try {
        mongoose.connection.on('error', ()=>{
            console.log('MongoDB | could not be connect to mongodb');
            mongoose.disconnect();
        })
        mongoose.connection.on('connecting', ()=>{
            console.log('MongoDB | Try connecting');
        })
        mongoose.connection.on('connected', ()=>{
            console.log('MongoDB | connected to mongoDB');
        })
        mongoose.connection.on('open', ()=>{
            console.log('Mongo DB | conected to database');
        })
        mongoose.connection.on('reconnected', ()=>{
            console.log('Mongo DB | reconnected to MongoDB');
        })
        mongoose.connection.on('disconnected', ()=>{
            console.log('MongoDB | disconnected');
        })

        await mongoose.connect(process.env.URI_MONGO,{
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50
        });
    }catch (e) {
        console.log('Database connection failed', e)
    }
}