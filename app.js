require('dotenv').config();
const express = require("express");
const app = express();
const port = 5775;
const cors = require("cors");
const db = require('./db.js');

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    const dtx = await db.getAllBackupWithCount();
    res.render("beranda", { data: dtx });
})

app.get("/status", (req, res) => {
    res.send(
        '{"kode":"01", "status":"API Berbasis ExpressJS OK"}'
    );
})

app.get("/api/backup", async (req, res) => {
    const dtx = await db.getAllBackupWithCount();
    res.json(dtx ? dtx : []);
});

app.get("/api/detail/:id", async (req, res) => {
    const dtx = await db.getDetailBackup(req.params.id);
    res.json(dtx);
});

app.listen(port, () => {
    console.log(`API Berjalan di Port: ${port}`);
})

app.post("/backup", async (req, res) => {
    let pesanx, kodex;
    let nama = req.body.nama_backup;
    let dtx = Buffer.from(req.body.dtx, 'base64').toString('utf-8');
    let id = Date.now();
    let arr_data = dtx.split("#");
    let proses = await db.tambahBackup(id, nama, "nodejs");
    if(proses == "1"){
        let berhasil = 0;
        let gagal = 0;
        for(let k of arr_data){
            let arr_data2 = k.split("|");
            let idx        = arr_data2[0];
            let deskripsix = arr_data2[1];
            let waktux     = arr_data2[2];
            let nominalx   = arr_data2[3];
            let jenisx     = arr_data2[4];
            let proses2 = await db.tambahTransaksi(`${id}-${idx}`, id, waktux, nominalx, jenisx, deskripsix);
            proses2 == "1" ? berhasil++ : gagal++;
        }
        pesanx = {kode: "01", status: "Proses Backup Berhasil dengan Rincian ", berhasil: berhasil, gagal: gagal};
        kodex = 200;
    }else{
        pesanx = {kode: "00", status: "Proses Backup Gagal, Periksa Kembali Data Anda"};
        kodex = 500;
    }
    return res.status(kodex).json(pesanx);
});