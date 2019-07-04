module.exports = function(io, User, _) {
  const userData = new User();

  io.on('connection', socket => {
    socket.on('refresh', data => {
      io.emit('refresh page', {});
    });

    socket.on('online', data => {
      socket.join(data.room);
      userData.enterRoom(socket.id, data.user, data.room);
      const list = userData.getList(data.room);
      io.emit('users online', _.uniq(list));
    });

    socket.on('disconnect', () => {
      const user = userData.removeUser(socket.id);
      if (user) {
        const userArray = userData.getList(user.room);
        const uniqArr = _.uniq(userArray);
        _.remove(uniqArr, name => name === user.name);
        io.emit('users online', uniqArr);
      }
    });
  });

};