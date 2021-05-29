const functions = require("firebase-functions");
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin')
const app = express()


app.use(express.json())


let users = []

// get all users
app.get('/',async (req,res)=>{
    const info = await admin.firestore().collection('users').get();

    info.forEach(doc => {
        let id = doc.id ;
        let data = doc.data();

        users.push({id, ...data})
    })
    res.json(users)

})

// get users by id
app.get('/:id',async (req,res)=>{

    const params_id = req.params.id;
    if(!params_id.exists){
        res.json({"status": false, "message": "Check id parametere"})
        return null ;
    }
    const info = await admin.firestore().collection('users').doc(params_id).get()

    const userId = info.id;
    const userData = info.data();

    res.send(JSON.stringify({id:userId, ... userData}))
})

//post users data
app.post('/',async (req,res)=>{
    const body = req.body;
    const user_details = await  admin.firestore().collection('users').add(body)

    if (!user_details.exists) 
    users.joined_on = admin.firestore.Timestamp.now().seconds;
    
    if (body.Fullname !== undefined)
        users["Fullname"] = body.Fullname;
    if (body.email_id !== undefined)
        users["email_id"] = body.email_id;
    if (body.phone_number !== undefined)
        users["phone_number"] = body.phone_number;
    if (params.dob !== undefined)
        users["dob"] = body.dob;
    if (body.gender !== undefined)
        users["gender"] = body.gender;
    if (body.city !== undefined)
        users["city"] = body.city;
    if (body.profile_pic !== undefined)
        users["profile_pic"] = body.profile_pic;
    


    if (Object.keys(users).length === 0) {
        response.json({ "status": false, "message": "Check Parameters" });
        return null;
    }
    console.log(req.body)
   res.json("user added")
})

app.put('/:id', async (req,res)=>{
    const params_id = req.params.id;

    if(!params_id.exists){
        res.json({"status": false, "message": "Check id parametere"})
        return null ;
    }
    const body = req.body;

   await admin.firestore().collection('users').doc(params_id).update({
        ...body
    })

    res.json("user updated")
    return null ;
})

app.delete('/:id',async (req,res)=>{
    const params_id = req.params.id;
    
    if(!params_id.exists){
        res.json({"status": false, "message": "Check id parametere"})
        return null ;
    }
    await admin.firestore().collection('users').doc(params_id).delete();

    res.send("user deleted")
})


exports.app;