const express = require("express");
const path = require("path");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

// ! New code 08/11

const cors = require("cors");
const nodemailer = require("nodemailer");

const dotenv = require("dotenv");
dotenv.config();

// ! ========== End section ==========

const isDev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`
    );
  });
} else {
  const app = express();

  // Answer API requests.
  // ! Commented out to test post request?
  // app.get("/api", function (req, res) {
  //   res.set("Content-Type", "application/json");
  //   res.send('{"message":"Hello from the custom server!"}');
  // });

  // All remaining requests return the React app, so it can handle routing.

  // ! New Code 8/11 ==================================

  // Use CORS
  app.use(cors());

  // ! Middleware to accept data in the body
  // ! Important to use in backend if you have POST, PUT, PATCH etc
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // ? Nodemailer section..
  // Transporter with Google settings
  let transporter = nodemailer.createTransport({
    // service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
      user: process.env.EMAIL,
      pass: process.env.GENERATEDGMAILPASSWORD,
    },
  });

  //  verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log(`!! Server is ready to take messages: ${success}`);
    }
  });
  app.post("/test", function (req, res) {
    console.log("Working!", req.body);
  });
  //  POST
  app.post("/send", function (req, res) {
    // ? Mail Options

    console.log("req body:", req.body);
    let mailOptions = {
      from: `${req.body.email},`,
      // // ! testing with new settings
      // from: "contact@edithsdev.com",
      // ! How to update that from field in my gmail shows the sender and not my email address?
      // sender: `${req.body.email}`,
      to: process.env.EMAIL,
      // Allows me to respond to the sender
      replyTo: `${req.body.email}`,
      // subject: `Message from:${req.body.name}`,
      subject: `${req.body.subject}`,
      text: `${req.body.message}`,
    };
    //  Send Mail
    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("Error " + err);
        res.status(500).json({
          status: "fail",
        });
      } else {
        console.log("Email sent successfully");
        res.status(200).json({ status: "success" });
      }
    });
  });

  // ! ==================================

  //  Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, "../client/build")));

  app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });

  app.listen(PORT, function () {
    console.error(
      `Node ${
        isDev ? "dev server" : "cluster worker " + process.pid
      }: listening on port ${PORT}`
    );
  });
}
