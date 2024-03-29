// import Dependencies
const fetchuser = require("../middleware/fetchuser");
const { validate } = require("../models/User");
const employees = require("../models/employees");
const express = require("express");
const router = express.Router();
const {body,validationResult} = require("express-validator");

// ROUTE 1: Get Data ENDPOINT /data/get Get Request
router.get("/get", fetchuser, async (req,res)=>{
    try{
        // Find Employees Data
        const data = await employees.find({user : req.user.id});
        // Respond With Data
        return res.json({data:data,type:"success"});
    }catch{
        return res.json({error:"Something Went wrong",type:"danger"})
    }
});

// ROUTE 2: Add New Data endPoint /data/add POST request
router.post("/add", fetchuser, [
    body("firstName","enter Valid Name").isLength({ min: 3}),
    body("lastName","enter Valid Lastname").isLength({ min: 3}),
    body("position","enter Valid Position").isLength({ min: 3}),
] ,async ( req,res ) => {
    try{

        // Validation error, showing bad request and error
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.json({error:"Enter Valid Values Min 3 char required*",type:"danger"});
        }

        // Get The Data from Request
        const firstname = req.body.firstName;
        const lastname = req.body.lastName;
        const position = req.body.position;

        // Create a Employee Data With it
        const employeeData = await employees.create({
            user: req.user.id,
            firstName: firstname,
            lastName: lastname,
            position: position
        });

        // Respond with Data
        return res.json({added:true,type:"success"})
    }catch (err){
        console.log(err);
        return res.json({error:"Something Went Wrong",type:"danger"})
    }
});

// ROUTE 3 : Update the old Data endPoint /data/update
router.put("/update/:id", fetchuser, [
    body("firstName","enter Valid Name").isLength({ min: 3}),
    body("lastName","enter Valid Lastname").isLength({ min: 3}),
    body("position","enter Valid Position").isLength({ min: 3}),
] ,async (req,res) => {
    try{

        // Get the id from url
        const employeid = req.params.id;

        // Get data from req
        const newfn = req.body.firstName;
        const newln = req.body.lastName;
        const newp = req.body.position;

         // Validation error, showing bad request and error
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.json({error:"Enter Valid Values Min 3 char required*",type:"danger"});
        }
        
        // Check feilds to be updated and creata an new object
        const newData = {};
        if(newfn){newData.firstName = newfn};
        if(newln){newData.lastName = newln};
        if(newp){newData.position = newp};

        const d = await employees.findById(employeid);

        if(!d){
            return res.json({error:"No Data Related to Id Found",type:"danger"});
        }

        if(d.user.toString() !== req.user.id){
            return res.json({error:"Not Allowed",type:"danger"});
        }

        // find and update the employee detail by id

        await employees.findByIdAndUpdate(employeid,newData);

        // Respond
        return res.json({updated:true,type:"success"});
    }catch {
        return res.json({error:"Something Went Wrong",type:"danger"});
    }
});

// ROUTE 4 : Delete Data endPoint /data/del
router.delete("/del/:id", fetchuser, async (req,res) => {
    try{
        // get the id from the url
        const employeid = req.params.id;

        const d = await employees.findById(employeid);

        if(!d){
            return res.json({error:"No Data Related to Id Found"});
        }
        if(d.user.toString() !== req.user.id){
            return res.json({error:"Not Allowed",type:"danger"});
        }

        // Delete that Record
        await employees.deleteOne({ _id: employeid });

        // Response
        return res.json({Deleted:true,type:"success"});
    }catch{
        return res.json({error:"Somthing Went Wrong",type:"danger"});
    }
});



module.exports = router;