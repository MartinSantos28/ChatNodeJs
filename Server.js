const { Server } = require("net");

const server = new Server();

function error(err) {
  console.error(err);
}


const connections = new Map();
const nombres = new Array();

function start(port) {
  
  server.on("connection", (socket) => {
    
   

    const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;

    console.log(`Nueva coneccion de  ${remoteSocket}`);

    
    socket.on("data", (data) => {
      if (!connections.has(socket)) {
        let bandera= true
        do{
          if(nombres.includes(data)){
            bandera= false
            socket.write("Este nombre ya esta en uso ingrese otro nombre")
            error("Escribe números");
        }else{
            nombres.push(data)
            connections.set(socket, data);
        }
        } while (bandera=false)
        
      } else if (data == "END") {
        socket.end();
        connections.delete(socket)
      } else {
        const full = `${connections.get(socket)} -> ${data}`;
        //socket.write(full);
        send(full, socket)
      }
    });
  });

  server.listen({ host: "172.26.192.1", port: port }, () => {
    console.log(`El servidor esta escuchando en el puerto ${port}`);
  });

  server.on("error", (err) => {
    error(err.message);
  });
}

function send(data, origin) {
    for(const socket of connections.keys()){
        //console.log(connections.keys())
        if(socket != origin){
            socket.write(data)
        }
    }
}

const main = () => {
  if (process.argv.length !== 3) {
    error(`Ingresa lo siguiente \n node ${__filename} port`);
  } else {
    let port = process.argv[2];
    port = parseInt(port);
    if (isNaN(port)) {
      error("Escribe números");
    } else {
      console.log(port);
      start(port);
    }
  }
};

main();
