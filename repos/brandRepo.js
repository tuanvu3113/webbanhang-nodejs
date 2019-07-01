var db = require('../fn/db');

exports.loadAll = () => {
    var sql = 'SELECT * FROM brands WHERE isdelete = 0';
    return db.load(sql);
}

exports.single = (id) => {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM brands WHERE BrandID = ${id} AND isdelete = 0`;
        db.load(sql).then(rows => {
            if (rows.length === 0) {
                resolve(null);
            }
            else {
                resolve(rows[0]);
            }
        }).catch(err => {
            reject(err);
        });
    });
}
exports.add = (c) => {
    var sql = `INSERT INTO brands(BrandName) VALUES('${c.BrandName}')`;
    return db.save(sql);
}

exports.delete = (id) => {
    var sql = `UPDATE brands SET isdelete = 1 WHERE BrandID = ${id}`;
    return db.save(sql);
}

exports.update = (b) => {
    var sql = `UPDATE brands set BrandName = '${b.BrandName}' WHERE BrandID = ${b.BrandID} AND isdelete = 0`;
    return db.save(sql);
}
exports.count = () => {
    var sql = "SELECT count(*) AS soluongth FROM brands WHERE isdelete = 0";
    return db.load(sql);
}

exports.search = (key) => {
    var sql = "SELECT * FROM brands WHERE BrandName LIKE '%" + `${key}` + "%' AND isdelete = 0";
    return db.load(sql);
}