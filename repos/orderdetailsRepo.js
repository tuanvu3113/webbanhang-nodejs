var db = require('../fn/db');

exports.loadAll = () => {
    var sql = 'SELECT * FROM orderdetails';
    return db.load(sql);
}

exports.single = (detailsId) => {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM orderdetails WHERE ID = ${detailsId} AND isdelete = 0`;
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

exports.singleID = (orderID) => {
    var sql = `SELECT * FROM orderdetails WHERE OrderID = ${orderID} AND isdelete = 0`;
    return db.load(sql);
}