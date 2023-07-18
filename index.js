const express = require("express");
const oracledb = require("oracledb");
const app = express();
const winston = require('winston');
const path = require('path');
const port = 3000;

const logsFolder = (__dirname, './logs/')

//Imported package to logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.join(logsFolder,`${new Date().toISOString().replace(/:/g, '-')}.log`) })
  ]
});


// Function to open connection to DB
async function createOraclePool(dbConfig,data) {
  try {
    const pool = await oracledb.createPool(dbConfig);
    logger.info(new Date() + "Pool opened.");
    setTimeout(() => {
      pool.close();
      logger.info(new Date() + 'Pool successfully Closed');
     }, 5000);
  } catch (err) {
    logger.error(new Date() + "Error occured while connecting DB:", err);
    process.exit(1);
    
  }
  logger.info(new Date() + "Entered Credentials: "+ JSON.stringify(dbConfig));
  logger.info(new Date() + "Entered Data: "+ JSON.stringify(data));
}

// Use public folder to serve static files.
app.use(express.static("public"));
app.use(express.json());

// Route - which will start on click the Button
app.post("/call-procedure", async (req, res) => {
  //Starting to power on the Function (Connecting to DB)
  logger.info(new Date() + 'createOraclePool function called');
  await createOraclePool(req.body.requestBody.dbConfig,req.body.requestBody.data);
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
    logger.error(new Date() + "Error occured during calling Procedure:", err);
    res.status(500).send("Error:" + err);
  } finally {
    if (connection) {
      try {
        await connection.close();
        logger.info(new Date() + "Oracle DB connection successfully closed");
      } catch (err) {
        logger.error(new Date() + "Oracle DB connection couldn't closed:", err);
      }
    }
  }
});

// Starting the server
app.listen(port, '0.0.0.0' , () => {
  console.log(new Date() + `Server is running at ${port}:th port 🚀🚀🚀.`);
  logger.info(new Date() + `Server is running at ${port}:th port 🚀🚀🚀.`);
});