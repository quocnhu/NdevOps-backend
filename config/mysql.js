import mysql from 'mysql2/promise'; // We use promise-based API for async/await

// Function to initialize the MySQL connection and execute a query
const mysqlInit = async () => {
  let connection;

  try {
    // Set up the connection to MySQL
    connection = await mysql.createConnection({
      host: 'localhost',      // MySQL host
      user: 'your_user',      // MySQL username
      password: 'your_password', // MySQL password
      database: 'your_database_name', // Your MySQL database
    });

    console.log('Connected to MySQL successfully!');

    // Example query: Fetching all users
    const [rows, fields] = await connection.execute('SELECT * FROM users');
    console.log('Users:', rows);

  } catch (err) {
    console.error('Error during MySQL operation:', err);
  } finally {
    // Ensure the connection is closed
    if (connection) {
      await connection.end();
      console.log('MySQL connection closed.');
    }
  }
};

// Call the function to initialize the connection and query the database
export default mysqlInit;
