const express = require('express');
const multer = require("multer");
const path = require('path');

const app = express();
app.use(express.json());

const fileStorage = multer.diskStorage({
    destination : (request, file, callback) => {
        callback(null, "./assets/uploads");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname);
    }
});

const upload = multer({ storage: fileStorage });

const users = [
    { UserID: 1, UserName: "Nandita Nayak" },
    { UserID: 2, UserName: "Kailash Behera" }
];

app.get('/', (req, res) => {
    // console.log('local ip address: ', req.ip); 
    const nodeUrl = '<a href="https://nodejs.org" target="_blank" style="color: cadetblue;text-decoration: none;">Node.js</a>';
    const expressUrl = '<a href="https://expressjs.com/" target="_blank" style="color: cadetblue;text-decoration: none;">Express</a>';
    res.send(`
        <h3 style="color:seagreen;font-family: cursive; text-align: center;">Greetings from Kailash</h3>
        <h1 style="margin-top: 12%; text-align: center;font-family: system-ui;color: cadetblue;">Welcome To ${nodeUrl} And ${expressUrl} &#128123;</h1> 
        <div style="text-align: center;"><img src='https://cdn4.iconfinder.com/data/icons/logos-3/456/nodejs-new-pantone-black-256.png' alt="Node.js"></div>
        <div style="text-align: center;"><a href="/upload">Upload File</a></div>
    `);
})

app.get('/api/users', (req, res) => {
    // console.log(req);
    res.send({
        status: true,
        message: "Data found successfully.",
        data: users
    });
})

app.get('/api/users/:id', (req, res) => {
    // console.log('Index: ', req.params.id);
    res.send({ data: users[req.params.id] });
})

app.get('/api/searchuser', (req, res) => {
    // console.log(req.query.UserId);
    const user = users.find(user => user.UserID === parseInt(req.query.UserId));
    if (!user) res.status(404).send({ status: false, message: 'User not found.' })
    else res.send({ status: true, message: "Data Found", data: user })
})

app.post('/api/adduser', (req, res) => {
    const newUser = { UserID: users.length + 1, UserName: req.body.UserName };
    users.push(newUser);
    res.send({ status: true, message: "User added successfully.", data: newUser });
})

// TEST API
app.get("/api/test", (req, res) => {
    res.send({
        status: true,
        message: "Your API running successfully at " + req.hostname + " on " + new Date().toString()
    })
});


// UPLOAD SINGLE FILE API
app.post("/api/uploadFile", upload.single('file'), (req, res) => {
    res.send({
        status: true,
        message: "File Uploaded Successfully",
        UploadedFileName: req.file.originalname
    });
});

app.get("/upload", (req, res) => {
    res.sendFile(path.join(__dirname + "\\upload.html"));
});

// SET PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}, click here http://localhost:${port}/ `);
});