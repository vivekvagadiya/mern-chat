const express=require('express');
const cors=require('cors');
const app=express();
const helmet=require('helmet');
app.use(helmet());
app.use(cors());
app.use(express.json());

module.exports=app;
