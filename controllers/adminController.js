var express = require('express');
var productRepo = require('../repos/productRepo');
var categoryRepo = require('../repos/categoryRepo');
var brandRepo = require('../repos/brandRepo');
var orderRepo = require('../repos/orderRepo');
var router = express.Router();
var config = require('../config/config');
var restrict = require('../middle-wares/restrict');
var multer = require('multer');
var path = require('path');

//Xử dụng multer để uoload hình lên server 
var upload = multer({
    storage: multer.diskStorage({
        //Lưu hình lên server với địa chỉ tùy chọn
        destination: function(req, file, callback) { callback(null, '/home/greystone/Downloads/web-ban-hang-master/public/uploads'); },
        filename: function(req, file, callback) {
            //Lưu với tên hình tùy chọn (ở đây là tao lưu với tên mặc định của hình)
            callback(null, file.originalname); 
        }
    }),
    fileFilter: function(req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback( /*res.end('Only images are allowed')*/ null, false);
        }
        callback(null, true);
    }
})

router.get('/', restrict, (req, res) => {
    if (req.session.user.f_Permission === 0) {
        res.redirect('/error/index');
    }
    else {
        var rowCountBrand = brandRepo.count();
        var rowCountCategory = categoryRepo.count();
        var rowCountProduct = productRepo.count();
        var rowCountOrder = orderRepo.count();
        Promise.all([rowCountProduct, rowCountBrand, rowCountCategory, rowCountOrder]).then(([rowProduct, rowBrand, rowCategory, rowCountOrder]) => {
            var vm = {
                layout: 'admin.handlebars',
                countProduct: rowProduct[0].soluong,
                countBrand: rowBrand[0].soluongth,
                countCategory: rowCategory[0].soluongtl,
                countOrder: rowCountOrder[0].sl_order
            }
            res.render('admin/index', vm);
        });
    }
})

//Action product
router.get('/product', restrict, (req, res) => {
    var query = unescape(req.query.search);
    var page = req.query.page;
    if (!page) {
        page = 1;
    }
    var offset = (page - 1) * config.PRODUCTS_PER_PAGE;
    if (query != '' && query != 'undefined') {
        var products = productRepo.search(query);
    } else {
        var products = productRepo.loadAll();
    }


    Promise.all([products]).then(([rows]) => {
        var nPages = rows.length / config.PRODUCTS_PER_PAGE;
        if (rows.length % config.PRODUCTS_PER_PAGE > 0) {
            nPages++;
        }

        var numbers = [];
        for (let i = 1; i <= nPages; i++) {
            numbers.push({
                value: i,
                isCurPage: i === +page
            });
        }
        var vm = {
            layout: 'admin.handlebars',
            products: rows.slice(offset, offset + config.PRODUCTS_PER_PAGE),
            query: query,
            page_numbers: numbers,
            hasPrevious: page != 1,
            hasNext: page != numbers.length,
            maxPage: numbers.length,
        };
        res.render('admin/product/index', vm);
    });
});


router.get('/product/add', restrict, (req, res) => {
    var getNameCat = productRepo.getCatName();
    var getNameBrand = productRepo.getBrandName();
    Promise.all([getNameCat, getNameBrand]).then(([getNameCat, getNameBrand]) => {
        var vm = {
            layout: 'admin.handlebars',
            arrCatName: getNameCat,
            arrBrandName: getNameBrand
        };
        res.render('admin/product/add', vm);
    });
});

//Edit product
router.get('/product/edit', restrict, (req, res) => {
    var getNameCat = productRepo.getCatName();
    var getNameBrand = productRepo.getBrandName();
    var getProduts = productRepo.single(req.query.id);
    Promise.all([getNameCat, getNameBrand, getProduts]).then(([getNameCat, getNameBrand, getProduts]) => {
        var vm = {
            layout: 'admin.handlebars',
            arrCatName: getNameCat,
            arrBrandName: getNameBrand,
            Product: getProduts
        };
        // console.log(vm);
        res.render('admin/product/edit', vm);
    });
});

router.post('/product/edit', restrict, (req, res) => {
    console.log(req.body);
    productRepo.edit(req.body).then(value => {
        res.redirect('/admin/product');
    });
});

//Delete Product
router.get('/product/delete', restrict, (req, res) => {
    var vm = {
        layout: 'admin.handlebars',
        ProID: req.query.id
    }
    res.render('admin/product/delete', vm);
});

router.post('/product/delete', restrict, (req, res) => {
    productRepo.delete(req.body.ProID).then(value => {
        res.redirect('/admin/product');
    });
});

//Add product
router.get('/product/add', restrict, (req, res) => {
    var vm = {
        layout: 'admin.handlebars',
        showAlert: false
    }
    res.render('admin/product/add', vm);
});

//Thực hiện save data gồm (giá, tên prodcut, catagores...) và name img muốn upload vào database đồng thời upload img lên file tùy chọn.
router.post('/product/add', upload.any(), function(req, res, next) {
    productRepo.add(req.body).then(value => {
        var vm = {
            layout: 'admin.handlebars',
            showAlert: true
        };
        res.render('admin/product/add', vm);
    }).catch(err => {
        res.end('fail');
    });
});


//Category
router.get('/category', restrict, (req, res) => {
    var query = unescape(req.query.search);
    var page = req.query.page;
    if (!page) {
        page = 1;
    }
    var offset = (page - 1) * config.PRODUCTS_PER_PAGE;
    if (query != '' && query != 'undefined') {
        var categories = categoryRepo.search(query);
    } else {
        var categories = categoryRepo.loadAll();
    }


    Promise.all([categories]).then(([rows]) => {
        var nPages = rows.length / config.PRODUCTS_PER_PAGE;
        if (rows.length % config.PRODUCTS_PER_PAGE > 0) {
            nPages++;
        }

        var numbers = [];
        for (let i = 1; i <= nPages; i++) {
            numbers.push({
                value: i,
                isCurPage: i === +page
            });
        }
        var vm = {
            layout: 'admin.handlebars',
            categories: rows.slice(offset, offset + config.PRODUCTS_PER_PAGE),
            query: query,
            page_numbers: numbers,
            hasPrevious: page != 1,
            hasNext: page != numbers.length,
            maxPage: numbers.length,
        };
            console.log(vm);

        res.render('admin/category/index', vm);
    });
});
//Edit Category
router.get('/category/edit', restrict, (req, res) => {
    categoryRepo.single(req.query.id).then(c => {
        var vm = {
            Category: c,
            layout: 'admin.handlebars',
        };
        res.render('admin/category/edit', vm);
    });
});

router.post('/category/edit', restrict, (req, res) => {
    categoryRepo.update(req.body).then(value => {
        res.redirect('/admin/category');
    });
});


//Delete Category
router.get('/category/delete', restrict, (req, res) => {
    var vm = {
        layout: 'admin.handlebars',
        CatId: req.query.id
    }
    res.render('admin/category/delete', vm);
});

router.post('/category/delete', restrict, (req, res) => {
    categoryRepo.delete(req.body.CatId).then(value => {
        res.redirect('/admin/category');
    });
});


//Add Category
router.get('/category/add', restrict, (req, res) => {
    var vm = {
        layout: 'admin.handlebars',
        showAlert: false
    }
    res.render('admin/category/add', vm);
});

router.post('/category/add', restrict, (req, res) => {
    console.log(req.body);
    categoryRepo.add(req.body).then(value => {
        var vm = {
            layout: 'admin.handlebars',
            showAlert: true
        };
        res.render('admin/category/add', vm);
    }).catch(err => {
        res.end('fail');
    });
});


//Brand
router.get('/brand', restrict, (req, res) => {
    var query = unescape(req.query.search);
    var page = req.query.page;
    if (!page) {
        page = 1;
    }
    var offset = (page - 1) * config.PRODUCTS_PER_PAGE;
    if (query != '' && query != 'undefined') {
        var brands = brandRepo.search(query);
    } else {
        var brands = brandRepo.loadAll();
    }

    Promise.all([brands]).then(([rows]) => {
        var nPages = rows.length / config.PRODUCTS_PER_PAGE;
        if (rows.length % config.PRODUCTS_PER_PAGE > 0) {
            nPages++;
        }

        var numbers = [];
        for (let i = 1; i <= nPages; i++) {
            numbers.push({
                value: i,
                isCurPage: i === +page
            });
        }
        var vm = {
            layout: 'admin.handlebars',
            brands: rows.slice(offset, offset + config.PRODUCTS_PER_PAGE),
            query: query,
            page_numbers: numbers,
            hasPrevious: page != 1,
            hasNext: page != numbers.length,
            maxPage: numbers.length,
        };
        res.render('admin/brand/index', vm);
    });
});


//Edit Brand
router.get('/brand/edit', restrict, (req, res) => {
    brandRepo.single(req.query.id).then(b => {
        var vm = {
            Brand: b,
            layout: 'admin.handlebars',
        };
        res.render('admin/brand/edit', vm);
    });
});

router.post('/brand/edit', restrict, (req, res) => {
    console.log(req.body);
    brandRepo.update(req.body).then(value => {
        res.redirect('/admin/brand');
    });
});

//Delete Brand
router.get('/brand/delete', restrict, (req, res) => {
    var vm = {
        layout: 'admin.handlebars',
        BrandID: req.query.id
    }
    res.render('admin/brand/delete', vm);
});

router.post('/brand/delete', restrict, (req, res) => {
    brandRepo.delete(req.body.BrandID).then(value => {
        res.redirect('/admin/brand');
    });
});

//Add brand
router.get('/brand/add', restrict, (req, res) => {
    var vm = {
        layout: 'admin.handlebars',
        showAlert: false
    }
    res.render('admin/brand/add', vm);
});

router.post('/brand/add', restrict, (req, res) => {
    brandRepo.add(req.body).then(value => {
        var vm = {
            layout: 'admin.handlebars',
            showAlert: true
        };
        res.render('admin/brand/add', vm);
    }).catch(err => {
        res.end('fail');
    });
});

//Action Order
router.get('/order', restrict, (req, res) => {
    var query = unescape(req.query.q);
    if (query) {
        var page = req.query.page;
        if (!page) {
            page = 1;
        }
        var offset = (page - 1) * config.PRODUCTS_PER_PAGE;
        orderRepo.loadAll().then(rows => {
            var nPages = rows.length / config.PRODUCTS_PER_PAGE;
            if (rows.length % config.PRODUCTS_PER_PAGE > 0) {
                nPages++;
            }

            var numbers = [];
            for (let i = 1; i <= nPages; i++) {
                numbers.push({
                    value: i,
                    isCurPage: i === +page
                });
            }
            var vm = {
                layout: 'admin.handlebars',
                orders: rows.slice(offset, offset + config.PRODUCTS_PER_PAGE),
                page_numbers: numbers,
                hasPrevious: page != 1,
                hasNext: page != numbers.length,
                maxPage: numbers.length
            };
            res.render('admin/order/index', vm);
        });
    }
});
module.exports = router;
