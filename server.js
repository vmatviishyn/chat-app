const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const _ = require('lodash');
const path = require('path');

const app = express();

const allowedOrigins = [
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:8080',
  'http://localhost:8100',
  'https://chat-ng-app.herokuapp.com',
];

app.use(cors());

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  }
}

app.options('*', cors(corsOptions));

app.get('/', cors(corsOptions), (req, res, next) => {
  res.json({ message: 'This route is CORS-enabled for an allowed origin.' });
})


const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const dbConfig = require('./config/secret');
const auth = require('./routes/authRoutes');
const posts = require('./routes/postRoutes');
const users = require('./routes/userRoutes');
const friends = require('./routes/friendsRoutes');
const message = require('./routes/messageRoutes');
const image = require('./routes/imageRoutes');

const { User } = require('./helpers/userClass');

require('./socket/streams')(io, User, _);
require('./socket/private')(io);

app.use(express.json({
  limit: '50mb'
}));

app.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}));

app.use(cookieParser());

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, { useNewUrlParser: true });

app.use('/api/chatapp', auth);
app.use('/api/chatapp', posts);
app.use('/api/chatapp', users);
app.use('/api/chatapp', friends);
app.use('/api/chatapp', message);
app.use('/api/chatapp', image);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist/chat-app'));
  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(
        __dirname, 'client', 'dist', 'chat-app', 'index.html'
      )
    );
  });
}

server.listen(process.env.PORT || 3000, () => {
  console.log('Running');
});