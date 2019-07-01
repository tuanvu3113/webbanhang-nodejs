var db = require('../fn/db');

exports.loadAll = () => {
    var sql = 'SELECT * FROM categories WHERE isdelete = 0';
    return db.load(sql);
}

exports.single = (id) => {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM categories WHERE CatID = ${id} AND isdelete = 0`;
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
    var sql = `INSERT INTO categories(catname) VALUES('${c.CatName}')`;
    return db.save(sql);
}

exports.delete = (id) => {
    var sql = `UPDATE categories SET isdelete = 1 WHERE CatId = ${id}`;
    return db.save(sql);
}

exports.update = (c) => {
    var sql = `UPDATE categories SET CatName = '${c.CatName}' WHERE CatID = ${c.CatId} AND isdelete = 0`;
    return db.save(sql);
}
exports.count = () => {
    var sql = "SELECT count(*) AS soluongtl FROM categories WHERE isdelete = 0";
    return db.load(sql);
}

exports.search = (key) => {
    var sql = "SELECT * FROM categories WHERE CatName LIKE '%" + `${key}` + "%' AND isdelete = 0";
    return db.load(sql);
}