var db = require('../fn/db');
var config = require('../config/config');

exports.loadAll = () => {
    var sql = 'SELECT p.*, b.BrandName, c.CatName FROM products p LEFT JOIN categories c ON c.CatID = p.CatID LEFT JOIN brands b ON b.BrandID = p.BrandID WHERE p.isdelete = 0 AND c.isdelete = 0 AND b.isdelete = 0 ORDER BY p.Date DESC';
    return db.load(sql);
}

exports.loadAllByCat = (catId, offset) => {
    var sql = `SELECT * FROM products WHERE CatID = ${catId} LIMIT ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return db.load(sql);
}

exports.loadAllByBrand = (brandId, offset) => {
    var sql = `SELECT * FROM products WHERE BrandID = ${brandId} LIMIT ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return db.load(sql);
}

exports.countByCat = catId => {
    var sql = `SELECT count(*) AS total FROM products WHERE CatID = ${catId}`;
    return db.load(sql);
}

exports.countByBrand = brandId => {
    var sql = `SELECT count(*) AS total FROM products WHERE BrandID = ${brandId}`;
    return db.load(sql);
}

exports.loadByNewestOption = (limit) => {
    var sql = `SELECT * FROM products ORDER BY Date DESC LIMIT ${limit}`;
    return db.load(sql);
}

exports.loadByViewOption = (limit) => {
    var sql = `SELECT * FROM products ORDER BY Viewer DESC LIMIT ${limit}`;
    return db.load(sql);
}

exports.loadBySoldOption = (limit) => {
    var sql = `SELECT * FROM products ORDER BY Sold DESC LIMIT ${limit}`;
    return db.load(sql);
}

exports.getCatName = () => {
    var sql = `SELECT CatID, CatName FROM categories WHERE isdelete = 0`;
    return db.load(sql);
}

exports.getBrandName = () => {
    var sql = `SELECT BrandID, BrandName FROM brands WHERE isdelete = 0`;
    return db.load(sql);
}

exports.single = (proID) => {
    return new Promise((resolve, reject) => {
        var sql = ` SELECT p.*, b.BrandName, c.CatName FROM products p
                    LEFT JOIN categories c ON c.CatID = p.CatID
                    LEFT JOIN brands b ON b.BrandID = p.BrandID
                    WHERE p.isdelete = 0 AND p.ProID = ${proID}`;
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

exports.get = (proID) => {
    var sql = `SELECT * FROM products WHERE ProID = ${proID}`;
    return db.load(sql);
}

exports.randomSameCategory = catID => {
    var sql = `SELECT * FROM products WHERE CatID = ${catID} ORDER BY RAND() LIMIT ${config.LIMIT_SAME}`;
    return db.load(sql);
}

exports.randomSameBrand = brandID => {
    var sql = `SELECT * FROM products WHERE BrandID = ${brandID} ORDER BY RAND() LIMIT ${config.LIMIT_SAME}`;
    return db.load(sql);
}

exports.search = (key) => {
    var sql = "SELECT * FROM products WHERE ProName like '%" + `${key}` + "%' AND isdelete = 0";
    return db.load(sql);
}

exports.count = () => {
    var sql = "SELECT count(*) AS soluong FROM products WHERE isdelete = 0";
    return db.load(sql);
}

exports.edit = (c) => {
    var sql = ` UPDATE products
                SET ProName = '${c.ProName}',
                    Price = '${c.Price}',
                    Quantity = '${c.Quantity}',
                    Description = '${c.Description}'
                WHERE isdelete = 0 AND ProID = ${c.ProID}`;
    return db.save(sql);
}


exports.delete = (id) => {
    var sql = `UPDATE products SET isdelete = 1 WHERE ProID = ${id}`;
    return db.save(sql);
}

exports.add = (c) => {
    var sql = ` INSERT INTO products (ProName, Description, Price, Quantity, CatID, BrandID, image) 
                VALUES('${c.ProName}', '${c.Description}', ${c.Price}, ${c.Quantity}, ${c.Cat}, ${c.Brand}, '${c.myImage}')`;
    return db.save(sql);
}
