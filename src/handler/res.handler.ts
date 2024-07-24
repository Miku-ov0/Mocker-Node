const vm = require('vm')
const axios = require('axios')
import { Script } from "vm"
import { ResType } from "../enums/res.type"


interface ResHandler {
    type: ResType
    handle(raw: string, params?: any): string
}

class JSONResHandler implements ResHandler {
    type: ResType.JSON

    handle(raw: string, params?: any): string {
        return raw
    }
}

class RawResHandler implements ResHandler {
    type: ResType.RAW

    handle(raw: string, params?: any): string {
        return raw
    }
}

class ELResHandler implements ResHandler {
    type: ResType.EL

    handle(raw: string, params?: any): string {
        return this.parseTemplateString(raw)
    }

    parseTemplateString(str) {
        const regex = /\${(.*?)}/g
        let match
        let result = str

        while ((match = regex.exec(str))) {
            const variable = match[1].trim()
            const value = vm.runInThisContext(variable)
            result = result.replace(match[0], value)
        }

        return result
    }
}

class JSResHandler implements ResHandler {
    private scriptMap = new Map<String, Script>()

    type: ResType.JS

    handle(raw: string, params?: any): string {
        const script = this.getScript(raw)
        params.setTimeout = setTimeout
        params.console = console
        params.axios = axios
        const sandBoxContext = vm.createContext(params)

        const r = script.runInContext(sandBoxContext)
        return sandBoxContext.resp?.body || r
    }

    getScript(code: string): Script {
        let script = this.scriptMap.get(code)
        if (!script) {
            script = new vm.Script(code)
            this.scriptMap.set(code, script)
        }
        return script
    }

}

export class ResHandlerFactory {
    private static handlerMap: Map<ResType, ResHandler> = new Map()
    static {
        this.handlerMap.set(ResType.RAW, new RawResHandler())
        this.handlerMap.set(ResType.EL, new ELResHandler())
        this.handlerMap.set(ResType.JS, new JSResHandler())
        this.handlerMap.set(ResType.JSON, new JSONResHandler())
    }
    static getResHandler(type: ResType) {
        return this.handlerMap.get(type)
    }
}