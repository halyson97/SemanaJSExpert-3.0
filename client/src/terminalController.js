import ComponentsBuilder from './components.js'
import { constants } from './constants.js'

export default class TerminalController {

    #usersCollors = new Map()

    constructor(){

    }

    #pickCollor(){
        return `#` + ((1 << 24) * Math.random() | 0).toString(16) +  `-fg`
    }

    #getUserCollor(userName){
        if(this.#usersCollors.has(userName))
            return this.#usersCollors.get(userName)

        const collor = this.#pickCollor()
        this.#usersCollors.set(userName, collor)

        return collor
    }

    #onInputReceived(eventEmitter){
        return function (){
            const message = this.getValue()
            this.clearValue()
        }
    }

    #onMessageReceived({ screen, chat }){
        return msg => {
            const { userName, message } = msg
            const collor = this.#getUserCollor(userName)
            chat.addItem(`{${collor}}{bold}${userName}{/}: ${message}`)
            screen.render()
        }
    }

    #onLogChanged({ screen, activityLog }){
        return msg => {
            const [userName] = msg.split(/\s/)
            const collor = this.#getUserCollor(userName)
            activityLog.addItem(`{${collor}}{bold}${msg.toString()}{/}`)
            screen.render()
        }
    }

    #onStatusChanged({ screen, status }){
        return users => {
            const { content } = status.items.shift()
            status.clearItems()
            status.addItem(content)
            users.forEach(userName => {
                const collor = this.#getUserCollor(userName)
                status.addItem(`{${collor}}{bold}${userName}{/}`)
            })

            screen.render()
        }
    }

    #registerEvents(eventEmitter, components){
        // eventEmitter.emit('turma01', 'hey')
        // eventEmitter.on('turma01', msg => console.log(msg.toString()))

        eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components))
        eventEmitter.on(constants.events.app.ACTIVITYLOG_UPDATED, this.#onLogChanged(components))
        eventEmitter.on(constants.events.app.STATUS_UPDATED, this.#onStatusChanged(components))
    }

    async initializeTable(eventEmitter){
        const components = new ComponentsBuilder()
            .setScreen({ title: 'Meu chat' })
            .setLayoutComponent()
            .setInputComponent(this.#onInputReceived(eventEmitter))
            .setChatComponent()
            .setActivityLogComponent()
            .setStatusComponent()
            .build()

        this.#registerEvents(eventEmitter, components)

        components.input.focus()
        components.screen.render()


        setInterval(()=> {
            const users = [`halyson`]

            eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, { message: `Ola`, userName: `halyson`})
            eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, { message: `Eae`, userName: `naiara`})

            eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, `naiara left`)
            eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, `naiara join`)

            eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, `halyson left`)
            eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, `halyson join`)

            eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
            users.push(`naiara`)
            eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
            users.push(`teste`)
            eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
            users.push(`novaconta`)
            eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
            users.push(`cavalomarinho`)
            eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)


        }, 1000)

    }
}