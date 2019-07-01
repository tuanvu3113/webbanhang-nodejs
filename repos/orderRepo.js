var db = require('../fn/db');

exports.loadAll = () => {
    var sql = 'SELECT o.*, u.f_Name AS fullname, u.f_Email AS email FROM orders AS o LEFT JOIN users AS u ON o.UserID = u.f_ID WHERE o.isdelete = 0 AND u.isdelete = 0';
    return db.load(sql);
}

exports.single = (OrderId) => {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM orders WHERE OrderID = ${OrderID} AND isdelete = 0`;
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
 exports.addbill =(Order)=>{
    var sql = `INSERT INTO orders(OrderDate, UserID,Address,Total,Phone) VALUES(NOW(),'${Order.userID}','${Order.address}','${Order.total}','${Order.phone}')`;
     return db.save(sql);

}
exports.upquantity =(Order)=>{
    var sql= `UPDATE products SET Quantity = ${Order.avai} WHERE ProID ='${Order.proId}' AND isdelete = 0`;
    return db.save(sql);
}

exports.upsold =(Order)=>{
    var sql= `UPDATE products SET Sold = ${Order.sold} WHERE ProID ='${Order.proId}' AND isdelete = 0`;
    return db.save(sql);
}
exports.addbilldetail = detail => {
    var sql = `INSERT INTO orderdetails(OrderID,ProID,ProName,Quantity,Price,Amount) VALUES('${detail.orderId}','${detail.proId}', '${detail.proName}'  , '${detail.quantity}', '${detail.price}','${detail.sum}')`;
    return db.save(sql);
}

exports.getIDBill = userID =>{
    var sql=`SELECT orders.OrderID AS ID FROM orders WHERE UserID = '${userID}' AND isdelete = 0`;
    return db.load(sql);

}


exports.removeall = (cart) => {
    for (var i = cart.length - 1; i >= 0; i--) {
        cart.splice(i, 1);
    }
    return;
}

exports.add = (cart, item) => {
    for (i = cart.length - 1; i >= 0; i--) {
        if (cart[i].proId === item.proId) {
            cart[i].quantity += item.quantity;
            return;
        }

    }
    cart.push(item);
}

exports.loadByUser = userID => {
    var sql = `SELECT * FROM orders WHERE UserID = ${userID} AND isdelete = 0`;
    return db.load(sql);
}

exports.count = () => {
    var sql = `SELECT COUNT(1) AS sl_order FROM orders WHERE isdelete = 0`;
    return db.load(sql);
}
