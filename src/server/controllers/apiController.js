// Test route to check if everything is running
module.exports.pong = async (req, res) => {
  try {
    console.log('Ping received');
    res.jsonp({ message: 'Pong' })
  } catch (error) {
    console.log('Error in receiving ping', error);
  }
}

