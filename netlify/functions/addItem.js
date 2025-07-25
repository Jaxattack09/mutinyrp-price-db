const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

const itemsFile = path.join(__dirname, '..', '..', 'items.json');
const ADMIN_PASS = process.env.ADMIN_PASS || 'mutinyadmin'; // Change to your secure pass

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { name, price } = JSON.parse(event.body);
    if (!name || !price || price <= 0) {
      return { statusCode: 400, body: 'Invalid input' };
    }
    let items = [];
    if (fs.existsSync(itemsFile)) {
      const data = fs.readFileSync(itemsFile, 'utf8');
      items = JSON.parse(data);
    }
    // Check for duplicates
    if (items.find(i => i.name.toLowerCase() === name.toLowerCase())) {
      return { statusCode: 409, body: 'Item already exists' };
    }
    const newItem = { id: nanoid(), name, price };
    items.push(newItem);
    fs.writeFileSync(itemsFile, JSON.stringify(items, null, 2));
    return { statusCode: 200, body: JSON.stringify(newItem) };
  } catch (err) {
    return { statusCode: 500, body: 'Server error' };
  }
};
