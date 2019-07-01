var db = require('../fn/db');

exports.loadAll = () => {
    var sql = 'SELECT * FROM ordersdetails';
    return db.load(sql);
}

exports.single = (detailsId) => {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM orders WHERE ID = ${detailsId}`;
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