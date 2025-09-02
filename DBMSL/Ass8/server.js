const mysql2 = require("mysql2/promise");

let connection;

const initTab = async () => {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS Colli (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE
      )
    `;
    try {
        await connection.execute(createTableSQL);
        console.log("Created Colli Table Successfully");
    } catch (err) {
        console.error('Error Initial:', err.message);
    }
}

const addUser = async (name, email) => {
    try {
        const sql = 'INSERT INTO Colli (name, email) VALUES (?, ?)';
        const [result] = await connection.execute(sql, [name, email]);
        console.log('User added with ID:', result.insertId);
    } catch (err) {
        console.error('Error adding Employee:', err.message);
    }
}

const deleteUser = async (id) => {
    try {
        const sql = 'DELETE FROM Colli WHERE id = ?';
        const [result] = await connection.execute(sql, [id]);
        console.log(`Deleted ${result.affectedRows} Colli(s)`);
    } catch (err) {
        console.error('Error deleting Colli:', err.message);
    }
}

const updateUser = async (id, name, email) => {
    try {
        const sql = 'UPDATE Colli SET name = ?, email = ? WHERE id = ?';
        const [result] = await connection.execute(sql, [name, email, id]);
        console.log(`Updated ${result.affectedRows} user(s)`);
    } catch (err) {
        console.error('Error updating user:', err.message);
    }
}

const getUsers = async () => {
    try {
        const sql = 'SELECT * FROM Colli';
        const [rows] = await connection.execute(sql);
        console.log('Colli:', rows);
        return rows;
    } catch (err) {
        console.error('Error getting Colli:', err.message);
        return [];
    }
}

const main = async () => {
    const dbConfig = {
        host: '10.10.8.119',
        user: 'te31463',
        password: 'te31463',
        database: 'te31463_db',
    };

    try {
        connection = await mysql2.createConnection(dbConfig);
        console.log("Connnection Created");
        await initTab();
        await addUser('Niraj', 'niraj@gmail.com');
        await addUser('Rajuu', 'raju@gmail.com');
        await getUsers();
        await updateUser(2, 'Raju', 'raju@mastercard.com');
        await getUsers();
        await deleteUser(2);
        await getUsers();
        connection.destroy();
        return;
    } catch (error) {
        console.log("Error in connnection" + error);
    }
};


main();

