import JsonStorage from '../utils/jsonStorage'
import User from '../models/user'

class UserRepository {
    storage: JsonStorage

    constructor(filePath: string) {
        this.storage = new JsonStorage(filePath)
    }

    getUsers() {
        try {
            return this.storage.readItems()
        } catch (err: any) {
            console.log('userRepository.ts / getUsers /Error: ', err.message)
        }
    }

    getUserById(userId: number) {
        try {
            const userArray: Array<User> = this.storage.readItems()
            return userArray.find((item) => item.id === userId)
        } catch (err: any) {
            console.log('userRepository.ts / getUserById /Error: ', err.message)
        }
    }

    getUserByLogin(login: string) {
        try {
            const userArray: Array<User> = this.storage.readItems()
            return userArray.find((item) => item.login === login)
        } catch (err: any) {
            console.log('userRepository.ts / getUserByLogin /Error: ', err.message)
        }
    }

    addUser(userModel: User) {
        try {
            const userArray: Array<User> = this.storage.readItems()
            userModel.id = this.storage.nextId
            this.storage.incrementNextId()
            userArray.push(userModel)
            this.storage.writeItems(userArray)
            return userModel.id
        } catch (err: any) {
            console.log('userRepository.ts / addUser /Error: ', err.message)
        }
    }

    updateUser(userModel: User) {
        try {
            const userArray: Array<User> = this.storage.readItems()
            userArray[userArray.findIndex((item) => item.id === userModel.id)] = userModel
            this.storage.writeItems(userArray)
        } catch (err: any) {
            console.log('userRepository.ts / updateUser /Error: ', err.message)
        }
    }

    deleteUser(userId: number) {
        try {
            const userArray: Array<User> = this.storage.readItems()
            const delIndex: number = userArray.findIndex((item) => item.id === userId)
            if (delIndex !== -1) userArray.splice(delIndex, 1)
            this.storage.writeItems(userArray)
        } catch (err: any) {
            console.log('userRepository.ts / deleteUser /Error: ', err.message)
        }
    }
}

export default UserRepository
