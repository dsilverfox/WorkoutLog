const Express = require('express');
const app = Express();

app.listen(3000, () => {
    console.log(`[SERVER] app is listening on port 3000.`);
});