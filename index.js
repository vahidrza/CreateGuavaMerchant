const express = require("express");
const oracledb = require("oracledb");
const app = express();
const port = 3000;

// Oracle DB Connection Parameters
const dbConfig = {
  user: "DEV",
  password: "Aa123456@",
  connectString: "10.10.34.143:1521/EPG",
};

// Open the connection to DB
async function createOraclePool() {
  try {
    await oracledb.createPool(dbConfig);
    console.log("Successfully Connected to DB.");
  } catch (err) {
    console.error("Error occured while connecting DB:", err);
    process.exit(1);
  }
}

// Open the connection to DB when Project started.
createOraclePool();

// Use public folder to serve static files.
app.use(express.static("public"));
app.use(express.json());

// Route - which will start on click the Button
app.post("/call-procedure", async (req, res) => {
  let connection;
  try {
    const data = req.body;
    connection = await oracledb.getConnection();
    // Calling Procedure
    await connection.execute(`begin create_merchant(p_ext_user_id => '${data.data[0]}',
    p_int_user_id => '${data.data[1]}',
    p_password_ext =>'${data.data[2]}',
    p_password_int => '${data.data[3]}',
    p_provider => '${data.data[4]}',
    p_ginfee => ${data.data[5]},
    p_group_id => ${data.data[6]});
    end;`);
    await connection.execute("COMMIT");
    res.status(200).send("Procedure successfully called.");
  } catch (err) {
    console.error("Error occured during calling Procedure:", err);
    res.status(500).send("Error occured during calling Procedure.");
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("Oracle DB connection successfully closed");
      } catch (err) {
        console.error("Oracle DB connection couldn't closed:", err);
      }
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at ${port}:th port 🚀🚀🚀.`);
});
