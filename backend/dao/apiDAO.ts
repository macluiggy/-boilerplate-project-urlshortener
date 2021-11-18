import mongoose = require('mongoose');

export default class ApiDAO {
    static async injectDB() {
        try {
            const uri = process.env.PW
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

let urlSchema = new mongoose.Schema({
  original: { type: String, required: true},
  short: Number
})

let urlModel = mongoose.model('URL', urlSchema)
        } catch(e) {
            console.error(e)
        }
    }
}
