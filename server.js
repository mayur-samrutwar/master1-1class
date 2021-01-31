const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3000
const bodyParser = require("body-parser")


app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

let pdfLink = "";

app.get("/", function(req, res){

    res.render("index", {pdfLink: "/pdf/sample.pdf"});
});

app.post("/", function (req, res){
pdfLink = req.body.pdfL;
res.render("index", {pdfLink: pdfLink});
});


app.use(express.static(__dirname + "/public"))
let clients = 0

io.on('connection', function (socket) {
    socket.on("NewClient", function () {
        if (clients < 2) {
            if (clients == 1) {
                this.emit('CreatePeer')
            }
        }
        else
            this.emit('SessionActive')
        clients++;
    })
    socket.on('Offer', SendOffer)
    socket.on('Answer', SendAnswer)
    socket.on('disconnect', Disconnect)
})

function Disconnect() {
    if (clients > 0) {
        if (clients <= 2)
            this.broadcast.emit("Disconnect")
        clients--
    }
}

function SendOffer(offer) {
    this.broadcast.emit("BackOffer", offer)
}

function SendAnswer(data) {
    this.broadcast.emit("BackAnswer", data)
}

http.listen(port, () => console.log(`Active on ${port} port`))



