const mongoose=require('mongoose')
const reviewModel=require("../models/reviewModel")
const bookModel=require("../models/bookModel")
const { isValid, isValidbody,isvalidString } = require("../validator/validator")


const addReview=async function(req,res){
try{

    let book_id=req.params.bookId
    let data=req.body


    if(!isValidbody(data)){ 
        return res.status(400).send("Please enter the review Details") 
   }

    if(!isValid(data.reviewedBy)){
        return res.status(400).send({ status: false, message: "Reviewer name must be present" })
    }

    if (!data.reviewedBy.match(/^[a-zA-Z. ]+$/)) {
        return res.status(400).send({ status: false, msg: "Reviewer can't be a number" }) 
    }

    if(!isValid(data.rating)){
        return res.status(400).send({ status: false, message: "Rating must be present" })
    }

    if (!(data.rating >= 1 && data.rating <= 5)) {
        return res.status(400).send({ status: false, message: "Rating must be in between 1 to 5." })
    }

    if(!isValid(data.review)){
        return res.status(400).send({ status: false, message: "Review must be present" })
    }
    if (!mongoose.isValidObjectId(book_id)) {
        return res.status(400).send({ status: false, message: "Invalid BookId." })
    }
    
    let checkBook=await bookModel.findById(book_id)

    if(!checkBook){
        return res.status(404).send({ status: false, message: "BookId Not Found" })
    }

    data.bookId=checkBook._id
    data.reviewedAt = new Date()
   
    let saveReview=await reviewModel.create(data)

    if (saveReview) {
        await bookModel.findOneAndUpdate({ _id: saveReview.bookId }, { $inc: { reviews: 1 } })
    }

    const reviewDetails = await reviewModel.findOne({ _id: saveReview._id }).select({__v: 0,createdAt: 0,updatedAt: 0,isDeleted: 0})
    
    checkBook.reviewsData=reviewDetails

    res.status(201).send({ status: true, message: "review created successfully", data: checkBook })
}
catch(err){
    res.status(500).send({ status: false, Error: err.message })
}
}

/******************************************************Update Review API*****************************************/





const updateReview=async (req,res)=>{
    try{
    const bookId=req.params.bookId
    const reviewId=req.params.reviewId
    let data=req.body
    const{review,rating,reviewedBy}=data

    if (!mongoose.isValidObjectId(reviewId)) {
        return res.status(400).send({ status: false, message: "reviewId is not valid" })
    }
    if (!mongoose.isValidObjectId(bookId)) {
        return res.status(400).send({ status: false, message: "bookId is not valid" })
    }
    

    if (!isValid(review)) {
        return res.status(400).send({ status: false, message: "plz enter review" })
    }
  if([1,2,3,4,5,"1","2","3","4","5"].indexOf(data.rating)==-1){
    return res.status(400).send({ status: false, message: "plz enter rating from 1 to 5" })
  }

    if (!isValid(reviewedBy)) {
        return res.status(400).send({ status: false, message: "plz enter reviewedBy" })
    }

    const reviewbookId=await reviewmodel.findOne({_id:reviewId,isDeleted:false})
    if(!reviewbookId){
        return res.status(404).send({status:false, msg: `This review id not found.`})
    }
    if (bookId != reviewbookId.bookId) {
        return res.status(404).send({status:false, msg: "This review not belongs to this particular book."})
     }

    const updateReview=await reviewmodel.findOneAndUpdate({_id:reviewId,isDeleted:false},{
        review,rating,reviewedBy
    },{new:true})
        res.status(200).send({ status: true,data:updateReview })


    }catch(err){
        res.status(500).send({ status: false,message:err.message })

    }
}

const deleteReview=async function(req,res){
    
    try{
        let reviewId=req.params.reviewId
        let bookId=req.params.bookId
        
        if(!mongoose.isValidObjectId(reviewId)){
            return res.status(400).send({status:false,msg:"Please Enter The Valid ReviewId "})}

         if(!mongoose.isValidObjectId(bookId)){
             return res.status(400).send({status:false,msg:"Please Enter The Valid bookId "})
        
        }
        let deletedReview=await reviewModel.findOneAndUpdate({_id:reviewId,isDeleted:false,bookId:bookId},{isDeleted:true,deletedAt:new Date()},{new:true})
        if(!deletedReview){
            return res.status(400).send({status:false,msg:"Sorry:No Review Found"})
        }

        return res.status(200).send({status:true,data:deletedReview})


        

    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})

    }

}




module.exports = { addReview,updateReview,deleteReview};
