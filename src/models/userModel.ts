import db from "../config/db";

export const getUserByUsername = (username: string) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE username = ?", [username], (err, results: any[]) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

export const createUser = (username: string, hashedPassword: string) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      (err) => {
        if (err) return reject(err);
        resolve(true);
      }
    );
  });
};
