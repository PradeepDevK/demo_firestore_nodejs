const express = require('express');
const app = express();

const admin =  require('firebase-admin');
const credentials = require('./key.json');

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/create', async(req, res) => {
    try {

        const { email, firstName, lastName } = req.body;

        const id = email;
        const userJson = {
            email,
            firstName,
            lastName
        };

        const response = await db.collection("users").doc(id).set(userJson);
        res.send(response);
    } catch(err) {
        res.send(err);
    }
});

app.get('/read/all', async(req, res) => {
    try {
        const userRef = db.collection('users');
        const response = await userRef.get();
        let responseArr = [];
        response.forEach(doc => {
            responseArr.push(doc.data());
        });
        res.send(responseArr);
    } catch(err) {
        res.send(err);
    }
});

app.get('/read/:id', async(req, res) => {
    try {
        const userRef = db.collection('users').doc(req.params.id);
        const response = await userRef.get();
        res.send(response.data());
    } catch(err) {
        res.send(err);
    }
});

app.put('/update', async(req, res) => {
    try {
        const { id, firstName, lastName } = req.body;
        const userRef = await db.collection('users').doc(id).update({ firstName, lastName });
        res.send(userRef);
    } catch(err) {
        res.send(err);
    }
});

app.delete('/delete/:id', async(req, res) => {
    try {
        const response = await db.collection('users').doc(req.params.id).delete();
        res.send(response);
    } catch(err) {
        res.send(err);
    }
});

const db = admin.firestore();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});