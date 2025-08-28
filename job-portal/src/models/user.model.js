import bcrypt from "bcrypt";

// in-memory store
let users = [];
let userId = 1;

export async function addUser({ name, email, password, role }) {
  const existing = users.find((u) => u.email === email);
  if (existing) throw new Error("Email already registered");

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: userId++, name, email, password: hashed, role: role || "jobseeker" };

  users.push(newUser);
  return newUser;
}

export async function confirmLogin(email, password) {
  const user = users.find((u) => u.email === email);
  if (!user) return "Invalid User";

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return "Invalid Credentials";

  return user;
}

// for testing/debug
export function getAllUsers() {
  return users;
}
