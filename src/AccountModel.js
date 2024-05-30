import mongoose from 'mongoose'

const AccountSchema = new mongoose.Schema({
    id: String,
    database: {
        type: [{
            username: String,
            balance: Number
        }],
        default: []
    }
})

const AccountModel = mongoose.model('Account', AccountSchema)

export default AccountModel