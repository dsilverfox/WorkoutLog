require("dotenv").config();

const Express = require("express");
const app = Express();

const dbConnection = require("./db");
const controllers = require("./controllers");
app.use(require("./middleware/headers"));

//Database Authentication
try {
    dbConnection.authenticate()
    .then(async () => await dbConnection.sync())
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`[SERVER] App is listening on ${process.env.PORT}`)
        })
    })
} catch (err) {
    console.log(`[SERVER] Server crashed!`)
}


//Non-Test Routes
app.use(Express.json());
app.use("/test", (req, res) => {
  res.send("This is a message from the test endpoint on the server!");
});
app.use("/log", controllers.logcontroller);
app.use("/user", controllers.usercontroller);