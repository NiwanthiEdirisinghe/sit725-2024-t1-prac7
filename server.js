const express = require("express");
const mongoose = require("mongoose");
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const password = encodeURIComponent("Ru4190416niwa#0");
const uri = `mongodb+srv://niwanthiedirisinghe95:${password}@cluster1.w8lef3h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

// Define the schema
const catSchema = new mongoose.Schema({
    title: String,
    image: String,
    link: String,
    description: String,
});

// Create the Cat model
const Cat = mongoose.model("Cat", catSchema);

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

connect();

// Serve static files from the public directory
app.use(express.static('public'));

// Serve the index.html file when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Serve the env.js file
app.get('/env.js', (req, res) => {
    res.set('Content-Type', 'text/javascript'); 
    res.sendFile(path.join(__dirname, 'env.js')); 
});

// Set up Socket.IO
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    setInterval(() => {
        socket.emit('number', parseInt(Math.random() * 10));
    }, 1000);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/cards", async (req, res) => {
  try {
    const cardList = await Cat.find();
    res.json({ statusCode: 200, data: cardList, message: "Success" });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
});

app.post("/api/cards", async (req, res) => {
  try {
    const { title, image, link, description } = req.body;
    
    const card = new Cat({ title, image, link, description });
    await card.save();

    res.status(201).json({ statusCode: 201, message: "New cat was added successfully!", data: card });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
});

server.listen(port, () => {
  console.log("App listening to: " + port);
});
