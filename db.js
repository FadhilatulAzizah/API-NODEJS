const mysql = require('mysql2/promise');
let sql;
const buatKoneksi = async () => {
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    })
}

const tambahBackup = async (id, nama, channel) => {
    const db = await buatKoneksi();
    sql = `INSERT INTO backup VALUES('${id}','${nama}','${channel}',NOW())`;
    try{
        await db.execute(sql);
        return "1";
    }catch(err){
        console.log("Error:", err.message);
        return "0";
    }
}

const tambahTransaksi = async (idx, id, waktux, nominalx, jenisx, deskripsix) => {
    const db = await buatKoneksi();
    sql = `INSERT INTO backup_transaksi VALUES('${idx}','${id}','${waktux}','${nominalx}','${jenisx}','${deskripsix}')`;
    try{
        await db.execute(sql);
        return "1";
    }catch(err){
        console.log("Error:", err.message);
        return "0";
    }
}

const getBackup = async () => {
    const db = await buatKoneksi();
    sql = "SELECT * FROM backup";
    const [rows] = await db.execute(sql);
    return rows.length > 0 ? rows : false;
}

const getAllBackupWithCount = async () => {
    const db = await buatKoneksi();
    sql = `SELECT b.*, COUNT(bt.id) as jumlah_transaksi 
           FROM backup b 
           LEFT JOIN backup_transaksi bt ON b.id = bt.id_backup 
           GROUP BY b.id 
           ORDER BY b.waktu DESC`;
    const [rows] = await db.execute(sql);
    return rows.length > 0 ? rows : [];
}

const getDetailBackup = async (id_backup) => {
    const db = await buatKoneksi();
    sql = `SELECT * FROM backup_transaksi WHERE id_backup = '${id_backup}' ORDER BY tgl_jam DESC`;
    const [rows] = await db.execute(sql);
    return rows.length > 0 ? rows : [];
}

module.exports = {buatKoneksi, tambahBackup, tambahTransaksi, getBackup, getAllBackupWithCount, getDetailBackup}