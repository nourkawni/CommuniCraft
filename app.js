const express = require('express');
const app = express();
app.use(express.json());     
const loginRouter = require('./routes/loginRoutes')
const projectRouter=require("./routes/projectLibraryrRoutes")


app.use('/login', loginRouter);
app.use('/api/Project', projectRouter);


app.listen(5000, () => {
    console.log("app is listening on the port 5000");
});
