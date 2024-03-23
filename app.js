const express = require('express');
const app = express();



app.use(express.json());
const loginRouter = require('./routes/loginRoutes')
const profileRouter = require('./routes/profileRoutes')
const borrowRouter = require('./routes/borrowRouter')
const notificationRouter = require('./routes/notificationRoutes')
const projectLibraryRouter = require('./routes/projectLibraryRoutes1')
const sellRouter = require('./routes/sellRoutes')
const chatRouter=require('./routes/external_API_routes')

const projectRouter=require("./routes/projectLibraryrRoutes")


app.use('/login', loginRouter);
app.use('/api/Project', projectRouter);

app.use('/login', loginRouter);
app.use('/profile', profileRouter);
app.use('/borrow', borrowRouter);
app.use('/notification', notificationRouter);

app.use('/projectLibrary', projectLibraryRouter);
app.use('/sell', sellRouter);
app.use('/chat',chatRouter)

app.listen(2008, () => {
    console.log("app is listening on the port 2000");
});

