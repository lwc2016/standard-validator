const strategies = require("./libs/strategies.js");
(function(){
    var Validator = function(data, rules){
        // 表单数据
        this.form = data || {};
        // 表单验证规则
        this.rules = rules || [];
        // 获取需要校验字段组成的列表
        this.keys = Object.keys(this.rules);
    };
    // 校验策略
    Validator.prototype.strategies = {...strategies};
    // 校验
    Validator.prototype.validate = function(callback){
        // 获取需要校验字段组成的数组
        let errors = {};
        let valid = true;
        this.keys.map(item => {
            // item: 校验字段
            this.rules[item].map(option=>{
                // 获取校验规则
                let strategy = Object.keys(this.strategies).find(i => option[i]);
                // 获取字段的值
                let value = this.form[item];
                // 获取校验规则
                let rule = {field: item, expected: option[strategy]};
                if(!strategy) throw new Error("请选择正确的校验规则");
                this.strategies[strategy](rule, value, (errorMsg)=>{
                    if(errorMsg){
                        valid = valid && false;
                        if(!errors[item]){
                            errors[item] = option.message || errorMsg;
                        }
                    }else{
                        valid = valid && true;
                    }
                });
            })
        });
        callback(valid ? null: errors);
    };
    // 导出模块
    module.exports = Validator;
})();
