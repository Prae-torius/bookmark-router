function makeBookmarksArray() {
  return [
    {
      id: 1,
      title: 'Netflix',
      url: 'www.netflix.com',
      description: 'test',
      rating: 4,
    },
    {
      id: 2,
      title: 'Google',
      url: 'www.google.com',
      description: 'test',
      rating: 4,
    },
    {
      id: 3,
      title: 'Twitch',
      url: 'www.twitch.com',
      description: 'test',
      rating: 4,
    },
    {
      id: 4,
      title: 'Smash.gg',
      url: 'www.smash.gg',
      description: 'test',
      rating: 4,
    }
  ]
}

module.exports = {
  makeBookmarksArray,
}