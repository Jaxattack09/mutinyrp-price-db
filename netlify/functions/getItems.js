const fs = require('fs');
const path = require('path');

const itemsFile = path.join(__dirname, '..', '..', 'items.json');

exports.handler = async function(event) {
  try {
    let items = [];
    if (fs.existsSync(itemsFile)) {
      const data = fs.readFileSync(itemsFile, 'utf8');
      items = JSON.parse(data);
    }
    return { statusCode: 200, body: JSON.stringify(items) };
  } catch (err) {
    return { statusCode: 500, body: 'Server error' };
  }
};
