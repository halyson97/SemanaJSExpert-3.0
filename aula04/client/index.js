#!/usr/bin/env node


/*
    chmod +x index.js
*/


import Events from 'events';
import CliConfig from './src/cliConfig.js';
import TerminalController from "./src/terminalController.js";
import SocketClient from './src/socket.js'
import EventManager from './src/eventManager.js';

const [nodePath, filePath, ...comands] = process.argv
const config = CliConfig.parseArguments(comands)

console.log(`config`, config)

const componentEmitter = new Events()

const socketClient = new SocketClient(config)

await socketClient.initialize()

const eventManager = new EventManager({ componentEmitter, socketClient })
const events = eventManager.getEvents()
socketClient.attachEvents(events)

const data = {
    roomId: config.room,
    userName: config.username
}

eventManager.joinRoomAndWaitForMessages(data)


const controller = new TerminalController()
await controller.initializeTable(componentEmitter)





