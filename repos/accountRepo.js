var db = require('../fn/db');

exports.add = user => {
    var sql = `INSERT INTO users(f_Username, f_Password, f_Name, f_Email, f_DOB, f_Permission) VALUES('${user.username}', '${user.password}', '${user.name}', '${user.email}', '${user.dob}', ${user.permission})`;
    return db.save(sql);
}

exports.login = user => {
    var sql = `SELECT * FROM users WHERE f_Username = '${user.username}' AND f_Password = '${user.password}'`;
    return db.load(sql);
}


exports.single = id => {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM users WHERE f_ID = ${id}`;
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

exports.UPDATE = user => {
    var sql=`UPDATE users SET f_Password='${user.password}', f_Name='${user.name}', f_Email='${user.email}',f_DOB='${user.dob}' WHERE f_ID = ${user.id}`;
    return db.save(sql);
}
