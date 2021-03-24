const path = require('path');
const express = require('express');
const app = express();
const UserRouter = require('./api/user/user.router');
const DB_Router = require('./config/db.router')
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${new Date().toString()} => ${req.originalUrl}`)
    next()
});

app.use('/api/users/', UserRouter);
app.use('/db', DB_Router);


const PORT = process.env.PORT || 3000;
app.listen(PORT,() => console.info(`Server has started on ${PORT}`));

