const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const dataDir = path.join(__dirname, '..', 'data');
const usersFile = path.join(dataDir, 'users.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    try {
      await fs.access(usersFile);
    } catch (e) {
      await fs.writeFile(usersFile, '[]', 'utf8');
    }
  } catch (err) {
    throw err;
  }
}

async function readUsers() {
  await ensureDataFile();
  const data = await fs.readFile(usersFile, 'utf8');
  return JSON.parse(data || '[]');
}

async function writeUsers(users) {
  await ensureDataFile();
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2), 'utf8');
}

function generateId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return crypto.randomBytes(16).toString('hex');
}

async function findOne(query) {
  const users = await readUsers();
  if (query.email) {
    return users.find((u) => u.email.toLowerCase() === String(query.email).toLowerCase()) || null;
  }
  return null;
}

async function create({ name, email, password, role = 'student' }) {
  const users = await readUsers();
  const id = generateId();
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = {
    _id: id,
    id,
    name,
    email: String(email).toLowerCase(),
    password: hashed,
    role,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsers(users);
  // Return a copy without password when appropriate
  const { password: pw, ...safe } = user;
  return safe;
}

async function findById(id, { includePassword = false } = {}) {
  const users = await readUsers();
  const user = users.find((u) => u._id === id || u.id === id) || null;
  if (!user) return null;
  if (includePassword) return { ...user };
  const { password, ...safe } = user;
  return safe;
}

async function comparePassword(enteredPassword, hashedPassword) {
  return await bcrypt.compare(enteredPassword, hashedPassword);
}

module.exports = {
  findOne,
  create,
  findById,
  comparePassword,
};
