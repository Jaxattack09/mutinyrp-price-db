const fs = require('fs');
const path = require('path');

const itemsFile = path.join(__dirname, '..', '..', 'items.json');
const ADMIN_PASS = process.env.ADMIN_PASS || 'mutinyadmin'; // Change to your secure pass

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { id, pass } = JSON.parse(event.body);
    if (pass !== ADMIN_PASS) {
      return { statusCode: 403, body: 'Forbidden' };
    }
    let items = [];
    if (fs.existsSync(itemsFile)) {
      const data = fs.readFileSync(itemsFile, 'utf8');
      items = JSON.parse(data);
    }
    items = items.filter(i => i.id !== id);
    fs.writeFileSync(itemsFile, JSON.stringify(items, null, 2));
    return { statusCode: 200, body: 'Deleted' };
  } catch (err) {
    return { statusCode: 500, body: 'Server error' };
  }
};
