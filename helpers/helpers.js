const User = require('../models/userModels');

module.exports = {
  firstUpper: username => {
    const name = username.toLowerCase();
    return name.charAt(0).toUpperCase() + name.slice(1);
  },

  lowerCase: str => str.toLowerCase(),

  updateChatList: async (req, msgId) => {
    await User.update(
      {
        _id: req.user._id
      },
      {
        $pull: {
          chatList: {
            receiverId: req.params.receiver_Id
          }
        }
      }
    );

    await User.update(
      {
        _id: req.params.receiver_Ids
      },
      {
        $pull: {
          chatList: {
            receiverId: req.user._id
          }
        }
      }
    );

    await User.update(
      {
      _id: req.user._id
      },
      {
        $push: {
          chatList: {
            $each: [
              {
                receiverId: req.params.receiver_Id,
                msgId: msgId._id
              }
            ],
            $position: 0
          }
        }
      }
    );

    await User.update(
      {
      _id: req.params.receiver_Id
      },
      {
        $push: {
          chatList: {
            $each: [
              {
                receiverId: req.user._id,
                msgId: msgId._id
              }
            ],
            $position: 0
          }
        }
      }
    );
  }
}