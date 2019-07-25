module.exports = {
    // 验证必填
    required: function(rule, value, callback){
        if(value === '' || value === undefined){
            callback(`${rule.field} is required`);
        }else{
            callback();
        }
    },
    // 最小长度
    minLength: function(rule, value, callback){
        if(value && value.length < rule.expected){
            callback(`${rule.field} length cannot be less then ${rule.expected}`)
        }else{
            callback();
        }
    },
    // 最大长度
    maxLength: function(rule, value, callback){
        if(value && value.length > rule.expected){
            callback(`${rule.field} length cannot be longer then ${rule.expected}`)
        }else{
            callback();
        }
    },
    // 校验手机号
    phone: function(rule, value, callback){
        if(value && !/1[3|5|7|8][0-9]{9}$/.test(value)){
            callback('invalid phone number!');
        }else{
            callback();
        }
    },
    // 校验正整数
    digit: function(rule, value, callback){
        if(!/^[0-9]*[1-9][0-9]*$/.test(value)){
            callback(`${rule.field} must be an digit`)
        }else{
            callback();
        }
    },
    // 最小值
    min: function(rule, value, callback){
        if(value && (value < rule.expected)){
            callback(`${rule.field} should not be less than ${rule.expected}`)
        }else{
            callback()
        }
    },
    // 最大值
    max: function(rule, value, callback){
        if(value && (value > rule.expected)){
            callback(`${rule.field} should not be greater than ${rule.expected}`)
        }else{
            callback();
        }
    },
    // 等于指定字段
    equal: function(rule, value, callback){
        if(value && value !== rule.form[rule.expected]){
            callback(`${rule.field} needs to be equal ${rule.expected}`);
        }else{
            callback();
        };
    },
    // 自定义校验规则
    validator: function(rule, value, callback){
        if(value && !rule.expected(value)){
            callback(`${rule.filed} is valid`);
        }else{
            callback();
        }
    }
};