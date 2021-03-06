const PRODUCTION_URL = 'https://semanajsexpert.herokuapp.com'

export default class CliConfig {
    
    constructor({username, room, hostUri = PRODUCTION_URL}){
        this.username = username
        this.room = room
        
        const { hostname, port, protocol } = new URL(hostUri)
        this.host = hostname
        this.port = port
        this.protocol = protocol.replace(/\W/, ``)
    }

    static parseArguments(commands){

        const cmd = new Map()

        for(const key in commands){

            const index = parseInt(key)
            const command = commands[key]

            const commandPreffix = `--`
            if(command.includes(commandPreffix)){
                cmd.set(
                    command.replace(commandPreffix, ``),
                    commands[index + 1]
                )
            }
        }

        return new CliConfig(Object.fromEntries(cmd))

    }
}