
import Events from 'events';
import CliConfig from './src/cliConfig.js';
import TerminalController from "./src/terminalController.js";
import SocketClient from './src/socket.js'

const [nodePath, filePath, ...comands] = process.argv
const config = CliConfig.parseArguments(comands)

console.log(`config`, config)

const componentEmitter = new Events()

const socketClient = new SocketClient(config)

await socketClient.initialize()

// const controller = new TerminalController()
// await controller.initializeTable(componentEmitter)



