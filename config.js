module.exports = {
  client: {
    token: process.env.TOKEN,
  },
  handler: {
    prefix: 'ch.',
    deploy: true,
    commands: {
      prefix: true,
      slash: true,
      user: true,
      message: true,
    },
    mongodb: {
      uri: '',
      toggle: true,
    },
  },
  users: {
    developers: ['916712541797896263', '824380535962468382', '657625518228766721'],
  },
};
