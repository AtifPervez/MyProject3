
// a function is defined to validate the data provided in the request body
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidTitle = function (title) {
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
}
const isvalidString=function(x){
    if(typeof x==="string" && x.trim().length===0) return false
    return true  
}

const isValidbody=function(x){
    return Object.keys(x).length>0
}

// Regex(s) used for the validation of different keys

let nameRegex = /^[.a-zA-Z\s]+$/
let emailRegex = /^[a-z]{1}[a-z0-9._]{1,100}[@]{1}[a-z]{2,15}[.]{1}[a-z]{2,10}$/
let phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/
let passRegex = /^[a-zA-Z0-9!@#$%^&*]{8,15}$/


module.exports = { isValid, isValidTitle,isvalidString,  nameRegex, emailRegex, phoneRegex, passRegex,isValidbody }  // --> exporting the variables defined in the module
