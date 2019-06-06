(function(){
    var Validator = function(data, rules){
        // 存储表单验证的错误
        this.errors = {};
        // 表单数据
        this.form = data || {};
        // 表单验证规则
        this.rules = rules || [];
        // 是否正确
        this.valid = true;
    };
    Validator.prototype.strategy = {
        // 验证必填
        required: function(field, message){
            let value = this.form[field];
            if(value === '' || value === undefined){
                this.addError(field, message || field + "值必须填写");
            }
        },
        // 最小长度
        minLength: function(field, message, length){
            let value = this.form[field] || '';
            if(value && value.length < length){
                this.addError(field, message || field + "长度不能小于" + length);
            }
        },
        // 最大长度
        maxLength: function(field, message, length){
            let value = this.form[field] || '';
            if(value && value.length > length){
                this.addError(field, message || field + "长度不能超过" + length);
            }
        },
        // 校验手机号
        phone: function(field, message){
            if(this.form[field] && !/1[3|5|7|8][0-9]{9}$/.test(this.form[field])){
                this.addError(field, message || "手机号不合法！");
            }
        },
        // 校验正整数
        digit: function(field, message){
            if(!/^[0-9]*[1-9][0-9]*$/.test(this.form[field])){
                this.addError(field, message || "填写正整数");
            }
        },
        // 最小值
        min: function(field, message, value){
            if(this.form[field] && (this.form[field] < value)){
                this.addError(field, message || "最小值不能小于" + value);
                return false;
            }
            return true;
        },
        // 最大值
        max: function(field, message, value){
            if(this.form[field] && (this.form[field] > value)){
                this.addError(field, message || "最大值不能大于" + value);
                return false;
            }
            return true;
        }
    };
    // 添加错误
    Validator.prototype.addError = function(field, message){
        this.valid = false;
        if(!this.errors[field]){
            this.errors[field] = message;
        }
    };
    Validator.prototype.validate = function(callback){
        // 将errors置空
        this.errors = {};
        // 获取需要校验字段组成的数组
        let keys = Object.keys(this.rules);

        keys.map(item => {
            // item: 校验字段
            this.rules[item].map(option=>{
                // 获取校验规则
                let strategy = Object.keys(this.strategy).find(i => option[i]);
                // 获取校验规则的值
                let value = option[strategy];
                if(!strategy) throw new Error("请选择正确的校验规则");
                return this.strategy[strategy].bind(this)(item, option.message, value);
            })
        });
        callback(this.valid ? null: this.errors);
    };
    // 导出模块
    module.exports = Validator;
})();
