const functions = require("firebase-functions");
var cors = require('cors')({origin: true});

const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

// auth trugger (new user sign up)

exports.newuserSignup = functions.auth.user().onCreate(user => {
  return admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    upvotedOn : []
  })
})

// auth trigger (user deleted)

exports.userdelete = functions.auth.user().onDelete(user=>{
 const doc = admin.firestore().collection('users').doc(user.uid)
 return doc.delete();
})


// http callable function .. (adding request)
exports.addRequest = functions.https.onCall((data,context)=>{
  if(!context.auth){
    throw new fucntions.https.HttpsError(
      'unauthenticated',
      'only authenticated users can add request'
    )
  }
  if(data.text.length >  30){
    throw new fucntions.https.HttpsError(
      'invalid-argument',
      'must have charecters less than 30'
    )
  }

  return admin.firestore().collection('requests').add({
    text : data.text,
    upvotes : 0
  })
})

// // upvote callable function
exports.upvote = functions.https.onCall(async (data, context) => {
  // check auth state
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'only authenticated users can vote up requests'
    );
  }
  // get refs for user doc & request doc
  const user = admin.firestore().collection('users').doc(context.auth.uid);
  const request = admin.firestore().collection('requests').doc(data.id);

 const doc = await user.get()
    // check thew user hasn't already upvoted
  if(doc.data().upvotedOn.includes(data.id)){
    throw new functions.https.HttpsError(
      'failed-precondition', 
      'You can only vote something up once'
    );
 }

    // update the array in user document
    await user.update({
      upvotedOn: [...doc.data().upvotedOn, data.id]
    })
  
      // update the votes on the request
      return request.update({
        upvotes: admin.firestore.FieldValue.increment(1)
      });
    


});