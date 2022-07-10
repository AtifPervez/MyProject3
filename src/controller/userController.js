const userModel = require("../models/userModel")
const { isValid, isValidTitle,isValidbody, nameRegex, emailRegex, phoneRegex, passRegex } = require("../validator/validator")

const pinValidator = require('pincode-validator')
const jwt=require("jsonwebtoken")


const createUser = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Provide the data in request body." })

        const { title, name, phone, email, password } = data

        if ( !isValid(title) || !isValidTitle(title.trim()) )  // --> title should be provided in the body
            return res.status(400).send({ status: false, message: "Please enter the title ('Mr', 'Miss', 'Mrs'). ⚠️" })

        if (!isValid(name))  // --> name should be provided in the body
            return res.status(400).send({ status: false, message: "Please enter the user name. ⚠️" })
        if (!nameRegex.test(name))  // --> name should be provided in right format
            return res.status(400).send({ status: false, message: "name should contain alphabets only. ⚠️" })

        if (!isValid(phone))  // --> phone number should be provided in the body
            return res.status(400).send({ status: false, message: "Please enter the phone number. ⚠️" })
        if (!phoneRegex.test(phone))  // --> phone number should be provided in right format
            return res.status(400).send({ status: false, message: "Enter the phone number in valid Indian format. ⚠️" })
        let getPhone = await userModel.findOne({ phone: phone });  // --> to check if provided phone number is already present in the database
        if (getPhone) {  // --> if that mobile number is already provided in the database
            return res.status(400).send({ status: false, message: "Phone number is already in use, please enter a new one. ⚠️" });
        }
        
        if (!isValid(email))  // --> email should be provided in the body
            return res.status(400).send({ status: false, message: "Please enter the email. ⚠️" })
        if (!emailRegex.test(email))  // --> email should be provided in right format
            return res.status(400).send({ status: false, message: "Please enter a valid emailId. ⚠️" })
        let getEmail = await userModel.findOne({ email: email });  // --> to check if provided email is already present in the database
        if (getEmail) {  // --> if that email is already provided in the database
            return res.status(400).send({ status: false, message: "Email is already in use, please enter a new one ⚠️" });
        }

        if (!isValid(password))  // --> password should be provided in the body
            return res.status(400).send({ status: false, message: "Please enter the password. ⚠️" })
        if (!passRegex.test(password))  // --> password should be provided in right format
            return res.status(400).send({ status: false, message: "Password length should be alphanumeric with 8-15 characters, should contain at least one lowercase, one uppercase and one special character." })

            if (data.address) {
            if (!isValidbody(data.address))return res.status(400).send({ status: false, message: "address can't be empty,Plz Enter the street, city and pincode in the address." })
            // if (!isValid(data.address.street) || !isValid(data.address.city) || !isValid(data.address.pincode))
            //     return res.status(400).send({ status: false, message: "Enter the street, city and pincode in the address." })
            let c=0
            Object.values(data.address).forEach(x=>{if(isValid(x)) c++})
            if(c==0)return res.status(400).send({ status: false, message: "Fill all details [street, city and pincode]" })

            if (!isValid(data.address.street))return res.status(400).send({ status: false, message: "Enter the street" })
            if (!isValid(data.address.city))return res.status(400).send({ status: false, message: "Enter the city" })
            if (!isValid(data.address.pincode))return res.status(400).send({ status: false, message: "Enter the pincode" })
           
            let pinValidated = pinValidator.validate(data.address.pincode)
            if (!pinValidated) return res.status(400).send({ status: false, message: "Please enter a valid pincode." })

            // let cityValidated = nameRegex.test(data.address.city)
            // if (!cityValidated) return res.status(400).send({ status: false, message: "Please enter a valid city name." })
        }

        let userCreated = await userModel.create(data)
        return res.status(201).send({ status: true, message: 'Success', data: userCreated })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const loginAuthor=async function(req,res){
    try{
    let data=req.body
    if (!isValidbody(data)) {
        return res.status(400).send({ status: false, message: "data not found,plz enter req details" })
    }
      let{email,password}=data 
      if (!isValid(email)) {
        return res.status(400).send({ status: false, message: "plz enter email" })
    }
    if (!isValid(password)) {
        return res.status(400).send({ status: false, message: "plz enter password" })
    }

    //email and password validation
    if (!/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email)) {
        return res.status(400).send({ status: false, message: "plz enter email in right format" })
    }
    if (!/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password)) {
        return res.status(400).send({ status: false, message: "plz enter valid password with atleast one uppercase and one lowercase and one charecter and one number" })
    }
      const getuserdata=await userModel.findOne({email,password})
      if(!getuserdata){
        return res.status(404).send({ status: false, message: "no data found with this email and password" })
}
      const token=jwt.sign({
        userId:getuserdata._id
      },"This-is-a-secret-key",{expiresIn:"12h"}) 
      res.status(200).send({status:true,message:"login successful",token})

    }catch(err){
        res.status(500).send({ status: false, message: err.message })

    }
}

module.exports = { createUser,loginAuthor}