"use strict";
const Validator = require("../index.js");
const assert = require("assert");

describe("validator", function(){
    it("测试required是否正确", function(done){
        var validator = new Validator({username: ''}, {
            username: [
                {required: true, message: "用户名必须填写！"}
            ]
        });
        var valid = validator.validate_on_submit();
        assert.equal(valid, false);
        assert.deepEqual(validator.errors, {"username": "用户名必须填写！"});
        done();
    });

    it("测试minLength是否正确", function(done){
        var validator = new Validator({password: '12345'}, {
            password: [
                {minLength: 6, message: "密码不能少于6位！"},
                {maxLength: 10, message: "密码不能超过8位！"}
            ]
        });
        let valid = validator.validate_on_submit();
        assert.equal(valid, false);
        assert.deepEqual(validator.errors, {"password": "密码不能少于6位！"});
        done();
    });

    it("测试maxLength是否正确", function(done){
       var validator = new Validator({password: "123456789012"}, {
           password: [
               {minLength: 6, message: "密码不能少于6位！"},
               {maxLength: 10, message: "密码不能超过8位！"}
           ]
       });
       assert.equal(validator.validate_on_submit(), false);
       assert.deepEqual(validator.errors, {"password": "密码不能超过8位！"});
       done();
    });

    it("测试phone是否正确", function(done){
        var validator = new Validator({phone: "13037109328"}, {
            phone: [
                {phone: true, message: "手机号不合法"}
            ]
        });
        assert.equal(validator.validate_on_submit(), true);

        var validator2 = new Validator({phone: "1303710932"}, {
            phone: [
                {phone: true, message: "手机号不合法"}
            ]
        });
        assert.equal(validator2.validate_on_submit(), false);
        assert.deepEqual(validator2.errors, {phone: "手机号不合法"});
        done();
    })

    it("测试digit是否正确", function(done){
       var validator = new Validator({age: 1.1}, {
           age: [
               {digit: true, message: "请填写正整数"}
           ]
       });
       assert.equal(validator.validate_on_submit(), false);

       var validator2 = new Validator({age: 1}, {
            age: [
                {digit: true, message: "请填写正整数"}
            ]
       });
       assert.equal(validator2.validate_on_submit(), true);

       var validator3 = new Validator({age: -1}, {
           age: [
               {digit: true, message: "请填写正整数"}
           ]
       });
       assert.equal(validator3.validate_on_submit(), false);
       done();
    });

    it("测试min是否正确", function(done){
        var validator = new Validator({age: 3}, {
            age: [
                {min: 12, message: "不能小于12岁"}
            ]
        });
        assert.equal(validator.validate_on_submit(), false);

        var validator2 = new Validator({age: 12}, {
            age: [
                {min: 12, message: "不能小于12岁"}
            ]
        });
        assert.equal(validator2.validate_on_submit(), true);

        var validator3 = new Validator({age: 13}, {
            age: [
                {min: 12, message: "不能小于12岁"}
            ]
        });
        assert.equal(validator3.validate_on_submit(), true);
        done();
    });

    it("测试max是否正确", function(done){
        var validator = new Validator({age: 8}, {
            age: [
                {min: 18, message: "不能大于18岁"}
            ]
        });
        assert.equal(validator.validate_on_submit(), false);
        done();
    })

    it("综合测试1", function(done){
        var validator = new Validator({
            username: "",
            password: "12345",
            phone: "1373018",
            age: 12
        }, {
            username: [
                {required: true, message: "请填写用户名！"}
            ],
            password: [
                {required: true, message: "请填写密码！"},
                {minLength: 6, message: "密码不能少于6位！"},
                {maxLength: 10, message: "密码不能超过10位！"}
            ],
            phone: [
                {required: true, message: "请填写手机号！"},
                {phone: true, message: "请填写合法手机号！"}
            ],
            age: [
                {min: 13, message: "不能小于13岁"},
                {max: 18, message: "不能大于18岁"}
            ]
        });
        assert.equal(validator.validate_on_submit(), false);
        assert.deepEqual(validator.errors, {
            username: "请填写用户名！",
            password: "密码不能少于6位！",
            phone: "请填写合法手机号！",
            age: "不能小于13岁"
        });
        done();
    });

    it("综合测试2", function(done){
        var validator = new Validator({
            username: ""
        }, {
            username: [
                {required: true, message: "请填写用户名！"}
            ],
            password: [
                {minLength: 6, message: "密码不能少于6位！"},
                {maxLength: 10, message: "密码不能超过10位！"}
            ],
            phone: [
                {phone: true, message: "请填写合法手机号！"}
            ],
            age: [
                {min: 13, message: "不能小于13岁"},
                {max: 18, message: "不能大于18岁"}
            ]
        });
        assert.equal(validator.validate_on_submit(), false);
        assert.deepEqual(validator.errors, {
            username: "请填写用户名！"
        });
        done();
    })
});
