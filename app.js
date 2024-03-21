const express = require('express');
const app = express();
app.use(express.json());

const loginRouter = require('./routes/loginRoutes')
const projectLibraryRouter = require('./routes/projectLibraryRoutes1')
const sellRouter = require('./routes/sellRoutes')

const chatRouter=require('./routes/external_API_routes')

app.use('/login', loginRouter);
app.use('/projectLibrary', projectLibraryRouter);
app.use('/sell', sellRouter);
app.use('/chat',chatRouter)

app.listen(4444, () => {
    console.log("app is listening on the port 9000");
});