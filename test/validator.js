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
        validator.validate(error=>{
            assert.deepEqual(error, {"username": "用户名必须填写！"});
            done();
        });
    });

    it("测试minLength是否正确", function(done){
        var validator = new Validator({password: '12345'}, {
            password: [
                {minLength: 6, message: "密码不能少于6位！"},
                {maxLength: 10, message: "密码不能超过8位！"}
            ]
        });
        validator.validate(err=>{
            assert.deepEqual(err, {"password": "密码不能少于6位！"});
            done();
        });
    });

    it("测试maxLength是否正确", function(done){
       var validator = new Validator({password: "123456789012"}, {
           password: [
               {minLength: 6, message: "密码不能少于6位！"},
               {maxLength: 10, message: "密码不能超过8位！"}
           ]
       });
       validator.validate(error=>{
           assert.deepEqual(error, {"password": "密码不能超过8位！"});
           done();
       })
    });

    it("测试equal是否正确", function(done){
        var validator = new Validator({password: "123456", confirmPassword: "123"}, {
            confirmPassword: [
                {equal: "password", message: "两次输入密码不一致！"}
            ]
        });
        validator.validate(err=>{
            assert.deepEqual(err, {confirmPassword: "两次输入密码不一致！"});
        });

        var validator2 = new Validator({password: "123456", confirmPassword: "123456"}, {
            confirmPassword: [
                {equal: "password", message: "两次输入密码不一致！"}
            ]
        });
        validator2.validate(err=>{
            assert.equal(err, null);
            done();
        });
    });

    it("测试phone是否正确", function(done){
        var validator = new Validator({phone: "13037109328"}, {
            phone: [
                {phone: true, message: "手机号不合法"}
            ]
        });
        validator.validate((err)=>{
            assert.equal(err, null);
        });


        var validator2 = new Validator({phone: "1303710932"}, {
            phone: [
                {phone: true, message: "手机号不合法"}
            ]
        });
        validator2.validate(err=>{
            assert.deepEqual(err, {phone: "手机号不合法"});
            done();
        });
    })

    it("测试digit是否正确", function(done){
       var validator = new Validator({age: 1.1}, {
           age: [
               {digit: true, message: "请填写正整数"}
           ]
       });
       validator.validate(err=>{
           assert.deepEqual(err, {age: "请填写正整数"});
       });


       var validator2 = new Validator({age: 1}, {
            age: [
                {digit: true, message: "请填写正整数"}
            ]
       });
       validator2.validate(err=>{
           assert.equal(err, null);
       });


       var validator3 = new Validator({age: -1}, {
           age: [
               {digit: true, message: "请填写正整数"}
           ]
       });
       validator3.validate(err=>{
           assert.deepEqual(err, {age: "请填写正整数"});
           done();
       });
    });

    it("测试min是否正确", function(done){
        var validator = new Validator({age: 3}, {
            age: [
                {min: 12, message: "不能小于12岁"}
            ]
        });
        validator.validate(err=>{
            assert.deepEqual(err, {age: "不能小于12岁"});
        });


        var validator2 = new Validator({age: 12}, {
            age: [
                {min: 12, message: "不能小于12岁"}
            ]
        });
        validator2.validate(err=>{
            assert.equal(err, null);
        });

        var validator3 = new Validator({age: 13}, {
            age: [
                {min: 12, message: "不能小于12岁"}
            ]
        });
        validator3.validate(error=>{
            assert.equal(error, null);
            done();
        });
    });

    it("测试max是否正确", function(done){
        var validator = new Validator({age: 28}, {
            age: [
                {max: 18, message: "不能大于18岁"}
            ]
        });
        validator.validate(err=>{
            assert.deepEqual(err, {age: "不能大于18岁"});
            done();
        });
    });

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
                {min: 0, message: "不能小于13岁"},
                {max: 18, message: "不能大于18岁"}
            ]
        });
        validator.validate(error=>{
            assert.deepEqual(error, {
                username: "请填写用户名！",
                password: "密码不能少于6位！",
                phone: "请填写合法手机号！"
            });
            done();
        });
    });

    it("综合测试2", function(done){
        var validator = new Validator({
            username: ""
        }, {
            username: [
                {required: true, message: "请填写用户名！"}
            ],
            password: [
                {minLength: 0, message: "密码不能少于6位！"},
                {maxLength: 10, message: "密码不能超过10位！"}
            ],
            phone: [
                {phone: true, message: "请填写合法手机号！"}
            ],
            age: [
                {min: 0, message: "不能小于13岁"},
                {max: 17, message: "不能大于18岁"}
            ]
        });
        validator.validate((error)=>{
            assert.deepEqual(error, {username: "请填写用户名！"});
            done();
        });
    })

    // 自定义校验规则
    it("自定义校验规则1", function(done){
        const validateAge = (value) =>{
            return value >= 18;
        };
        var validator = new Validator({
            age: 12
        }, {
            age: [
                {validator: validateAge, message: "年龄不能小于18岁"}
            ]
        });
        validator.validate((error)=>{
            assert.deepEqual(error, {age: "年龄不能小于18岁"});
            done();
        });
    });

    it("自定义校验规则2", function(done){
        const validateAge = (value) =>{
            return value >= 18;
        };
        var validator = new Validator({
            age: 20
        }, {
            age: [
                {validator: validateAge, message: "年龄不能小于18岁"}
            ]
        });
        validator.validate((error)=>{
            assert.equal(error, null);
            done();
        });
    });
});
