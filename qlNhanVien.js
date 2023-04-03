const express = require('express')
const mongoose = require('mongoose')
const expressHbs = require('express-handlebars')

const uri = require('./mylocalNhanVien')
const nhanvienModel = require('./NhanVienModel')

const mongodb = require('mongodb')
const bodyParser = require('body-parser')
const app = express()

app.engine('.hbs', expressHbs.engine({
    extname: "hbs",
    defaultLayout: 'main',
    layoutsDir: "views/layouts/"
}))
app.set('view engine', '.hbs')
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
    let chk = req.query.chkadd
    try {
        await mongoose.connect(uri)
        const listNV = await nhanvienModel.find().lean()
       
        res.render('pagelistNV', { dataNV: listNV, chkadd: chk })
    } catch (error) {
        console.log(error);
    }

})
app.post('/addNV', async (req, res) => {
    let rs = req.body
    let nv = new nhanvienModel({
        ten: rs.nameNV,
        diachi: rs.addressNV,
        luong: parseInt(rs.salaryNV)
    })
    try {
        await nv.save()
        res.redirect('/?chkadd=true')
    } catch (error) {

    }
})
app.get('/deleteNV', async (req, res) => {
    let idNV = req.query.idNV
    try {
        nhanvienModel.collection.deleteOne({ _id: new mongodb.ObjectId(idNV) })
        res.redirect('/')
    } catch (error) {

    }
    console.log(idNV);
})
app.post('/upNV', async (req, res) => {
    let rs = req.body
    try {
        await nhanvienModel.collection.updateOne({ _id: new mongodb.ObjectId(rs.idEdit) }, { $set: { ten: rs.nameNV, diachi: rs.addressNV, luong: parseInt(rs.salaryNV) } })
        res.redirect('/')
    } catch (error) {
        console.log(error);
    }
})

app.listen(8000, () => {
    console.log("Dang chay");
})