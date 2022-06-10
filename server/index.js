const http = require("http")
const app = require("./app");
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// server listening 
server.listen(port, () => {
    
    //http://localhost:4001/register
  console.log(`Task director running: http://localhost:${port}`);
});