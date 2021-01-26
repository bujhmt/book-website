import JsonStorage from '../utils/jsonStorage'
import fs from 'fs'

class MediaRepository {
    storage: JsonStorage
    path: string

    constructor(filePath: string) {
        this.path = filePath
        this.storage = new JsonStorage(filePath + '/supportData.json')
    }

    get currentId() {
        try {
            return this.storage.nextId - 1
        } catch (err) {
            console.log(err.message)
        }
    }

    get reserveNextId() {
        try {
            this.storage.incrementNextId()
            return this.storage.nextId - 1
        } catch (err) {
            console.log(err.message)
        }
    }

    get supportedFileFormats() {
        try {
            return this.storage.readAll().fileFormats
        } catch (err) {
            console.log(err.message)
        }
    }

    checkMediaExists(id: number) {
        try {
            for (const item of this.supportedFileFormats) {
                const fullPath: string = this.path + '/' + String(id) + '.' + item

                if (fs.existsSync(fullPath)) return fullPath
            }
            return undefined
        } catch (err) {
            console.log(err.message)
        }
    }
}

export default MediaRepository
