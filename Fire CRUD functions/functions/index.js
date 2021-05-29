const functions = require("firebase-functions");
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin')

const profile = require('./profile')

admin.initializeApp();



exports.profile = functions.https.onRequest(profile.app)




