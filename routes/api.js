var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(req.query);
    if (req.query.add) {
        var fs = require("fs");
        var dr = "./save/User.json";
        // get information post
        var im = JSON.parse(req.query.add);
        var errs = [];
        var token = im.token;
        var time = 5;
        var times = 1;
        var mess = im.mess;
        var pgid = im.pgid;
        
        var data = require(dr);
        data.push({
            token: token,
            time: time,
            times: times,
            mess: mess,
            pgid: pgid,
            status: "stop"
        });
        fs.writeFile(dr, JSON.stringify(data), (er => {
            if (err) throw err;
            res.end(JSON.stringify({status: "success"}));
        }))
        
        
        res.end(JSON.stringify({add: true}));
    }
    
    else
        res.send({});
});

module.exports = router;
