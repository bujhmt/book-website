const fs = require('fs')

interface JsonStorageModel {
    nextId: number
    items: Array<any>
}

class JsonStorage {
    filePath: string

    // filePath - path to JSON file
    constructor(filePath: string) {
        this.filePath = filePath
    }

    readAll() {
        try {
            const jsonText: string = fs.readFileSync(this.filePath)
            return JSON.parse(jsonText)
        } catch (err: any) {
            console.log('jsonStorage.ts / readAll /Error: ', err.message)
        }
    }

    readItems() {
        try {
            const jsonText: string = fs.readFileSync(this.filePath)
            const jsonObject: JsonStorageModel = JSON.parse(jsonText)
            return jsonObject.items
        } catch (err: any) {
            console.log('jsonStorage.ts / readItems /Error: ', err.message)
        }
    }

    get nextId() {
        try {
            const jsonText: string = fs.readFileSync(this.filePath)
            const jsonObject: JsonStorageModel = JSON.parse(jsonText)
            return jsonObject.nextId
        } catch (err: any) {
            console.log('jsonStorage.ts / nextId /Error: ', err.message)
        }
    }

    incrementNextId() {
        try {
            const jsonText: string = fs.readFileSync(this.filePath)
            const jsonObject: JsonStorageModel = JSON.parse(jsonText)
            jsonObject.nextId++

            fs.writeFileSync(this.filePath, JSON.stringify(jsonObject, null, 2), 'utf8')
        } catch (err: any) {
            console.log('jsonStorage.ts / incrementNextId /Error: ', err.message)
        }
    }

    writeItems(items: Array<any>) {
        try {
            const jsonText: string = fs.readFileSync(this.filePath)
            const jsonObject: JsonStorageModel = JSON.parse(jsonText)
            jsonObject.items = items

            fs.writeFileSync(this.filePath, JSON.stringify(jsonObject, null, 2), 'utf8')
        } catch (err: any) {
            console.log('jsonStorage.ts / writeItems /Error: ', err.message)
        }
    }
}

export default JsonStorage
