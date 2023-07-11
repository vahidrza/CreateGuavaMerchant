const express = require("express");
const oracledb = require("oracledb");
const app = express();
const port = 3000;

// Function to open connection to DB
async function createOraclePool(dbConfig) {
  try {
    const pool = await oracledb.createPool(dbConfig);
    console.log("Pool opened.");
    setTimeout(() => {
      pool.close();
      console.log('Pool successfully Closed');
     }, 5000);
  } catch (err) {
    console.error("Error occured while connecting DB:", err);
    process.exit(1);
    
  }
  console.log("Entered Credentials: "+ JSON.stringify(dbConfig));
}

// Use public folder to serve static files.
app.use(express.static("public"));
app.use(express.json());

// Route - which will start on click the Button
app.post("/call-procedure", async (req, res) => {
  //Starting to power on the Function (Connecting to DB)
  console.log('createOraclePool function called');
  await createOraclePool(req.body.requestBody.dbConfig);
  let connection;

  try {
    //Getting Data from Request
    const data = req.body.requestBody.data;
    connection = await oracledb.getConnection();

    // Calling Procedure
    await connection.execute(`begin create_merchant(
    p_ext_user_id => '${data[0]}',
    p_int_user_id => '${data[1]}',
    p_password_ext =>'${data[2]}',
    p_password_int => '${data[3]}',
    p_provider => '${data[4]}',
    p_ginfee => ${data[5]},
    p_group_id => ${data[6]});
    end;`);

    //Commiting the query
    await connection.execute("COMMIT");
    res.status(200).send("Procedure successfully called and committed.");
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

// Starting the server
app.listen(port, () => {
  console.log(`Server is running at ${port}:th port 🚀🚀🚀.`);
});