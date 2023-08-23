const User = require('../models/users');
const { infoLogger, errorLogger } = require("../logs/logs");
let bcrypt = require('bcryptjs');
const { recycleBinService } = require('../services/recycleBinService');
const { userService } = require('../services/userService');
const nodemailer = require('nodemailer');

exports.usersController = {
    getUsers(req, res) {
        infoLogger.info("Get all Users");
        if (req.query.sort == "wallet") {
            infoLogger.info("Success to Get all sorted users");
            User.find({}).sort({ wallet: -1 })
                .then(user => {
                    infoLogger.info("Success to Get all sorted users");
                    res.json(user)
                })
                .catch(err => {
                    errorLogger.error(`Error getting the data from db:${err}`)
                    res.status(500).json({ "message": `Error Gets sorted users  ` });
                });
        } else {
            User.find({})
                .then(user => {
                    infoLogger.info("Success to Get all users");
                    res.json(user)
                })
                .catch(err => {
                    errorLogger.error(`Error getting the data from db:${err}`)
                    res.status(500).json({ "message": `Error Gets users ` });
                });
        }
    },
    getUserDetails(req, res) {
        infoLogger.info(`Get User id:${req.params.id}`);
        User.findOne({ _id: req.params.id })
            .then((user) => {
                if (user) {
                    res.json(user)
                }
                else {
                    errorLogger.error("Wrong user id please enter correct id");
                    res.status(400).json({ "message": "Wrong user id please enter correct id" });
                }
            })
            .catch(err => {
                errorLogger.error(`Error Getting user from db:${err}`);
                res.status(500).json({ "message": `Error getting user ` });
            });
    },
    async editUserDetails(req, res) {
        infoLogger.info("Updating a user");
        if (req.params.id != req.userId) {
            if (req.userId) {
                isMod = await userService.isModerator(req.userId);
            }
            if (!isMod) {
                errorLogger.error(`unauthorized user ${req.userId}`);
                res.status(401).json({ "message": "Unauthorized user" });
                return;
            }
        }
        const user = await User.findOne({ _id: req.params.id  })
            console.log(user.password)
            console.log(req.body.password)
            if (req.body.password!==user.password) {
                 infoLogger.info(`Updating Password user no:${req.params.id} is successfully`);
                 req.body.password=bcrypt.hashSync(req.body.password, 8);
            }
        User.updateOne({ _id: req.params.id }, req.body)
            .then((result) => {

                if (result.matchedCount > 0) {
                    infoLogger.info(`Updating user no:${req.params.id} is successfully`);
                    res.json({ "message": `Updating user no:${req.params.id} is successfully` });
                }
                else {
                    errorLogger.error("Wrong user id please enter correct id");
                    res.status(400).json({ "message": "Wrong user id please enter correct id" });
                }
            })
            .catch((err) => res.status(400).json(err));
    },
    async deleteUser(req, res) {
        infoLogger.info("Delete a user");
        if (req.params.id != req.userId) {
            if (req.userId) {
                isMod = await userService.isModerator(req.userId);
            }
            if (!isMod) {
                errorLogger.error(`unauthorized user ${req.userId}`);
                res.status(401).json({ "message": "Unauthorized user" });
                return;
            }
        }

        User.deleteOne({ _id: req.params.id })
            .then((result) => {
                if (result.deletedCount > 0) {
                    infoLogger.info(`Deleting user no:${req.params.id} is successfully`);
                    res.json({ "message": `Deleting user no:${req.params.id} is successfully` });
                }
                else {
                    errorLogger.error(`user no:${req.params.id} does not exists`);
                    res.status(400).json({ "message": `user no:${req.params.id} does not exists` });
                }
            })
            .catch(() => {
                errorLogger.error(`Error Deleting user no:${req.params.id} `);
                res.status(400).json({ "message": `Error Deleting user no:${req.params.id} ` });
            });
    },
    async addActivity(req, res) {
        infoLogger.info(`Add Activity to user ${req.params.id}`);
        if (req.params.id != req.userId) {
            if (req.userId) {
                isMod = await userService.isModerator(req.userId);
            }
            if (!isMod) {
                errorLogger.error(`unauthorized user ${req.userId}`);
                res.status(401).json({ "message": "Unauthorized user" });
                return;
            }
        }
        
        const { dateTime, recycleBinID, totalBottles, items,capacity } = req.body;
        console.log(req.body)

        if (dateTime && recycleBinID && totalBottles && items && capacity) {

            User.findOne({ _id: req.params.id })
                .then((user) => {
                    if (!user) {
                        errorLogger.error(`no user with id ${req.params.id}`);
                        res.status(400).json({ "message": `no user with id ${req.params.id}` });
                    }
                    else {
                        const activities = user.activities ?? [];
                        const newActivity = {
                            dateTime,
                            recycleBinID,
                            totalBottles,
                            items,
                            points: 0
                        };
                        items.forEach((item) => {
                            infoLogger.info(`Add items to user ${req.params.id} Item name: ${item.itemName} Quantity: ${item.quantity} Images URL: ${item.imagesUrl}`);
                            if (item.itemName === 'plastic') {
                                newActivity.points += 100*item.quantity;
                            } else if (item.itemName === 'glass') {

                                newActivity.points += 150*item.quantity;
                            } else if (item.itemName === 'can') {

                                newActivity.points += 200*item.quantity;
                            }
                        });
                        
                        if (!recycleBinService.increaseCurrentCapacity(recycleBinID, capacity)) {
                            errorLogger.error("cannot throw into recycleBin");
                            res.status(406).json({ "message": "Cannot throw into recycleBin" });
                            return;
                        }
                        
                        activities.push(newActivity);
                       
                        User.updateOne({ _id: req.params.id }, { wallet: (user.wallet + newActivity.points), activities })
                            .then((result) => {
                                if (result.matchedCount > 0) {
                                    infoLogger.info(`Updating user's activities no:${req.params.id} is successfully`);
                                    res.json(newActivity);
                                }
                                else {
                                    errorLogger.error("Wrong user id please enter correct id");
                                    res.status(400).json({ "message": "Wrong user id please enter correct id" });
                                }
                            })
                            .catch((err) => res.status(400).json(err));
                    }
                })
                .catch(err => {
                    errorLogger.error(`Error Getting user from db:${err}`);
                    res.status(400).json({ "message": `Error Adding user ` });
                });
        } else {
            errorLogger.error("Missing Parameters Please send all Parameters ");
            res.status(400).json({ "message": "Missing Parameters Please send all Parameters" });
        }
    },
    async  addMunicipalUser(req, res) {
        infoLogger.info("Add Municipal User");
        const { name, email, imgUrl, password, city,userType} = req.body;
        
        console.log( name, email, imgUrl, password, city,userType)
        if ( name && email && imgUrl && password && city && userType) {
            User.findOne({ email: email })
                .then((user) => {
                    if (user) {
                        errorLogger.error("this email is already exists");
                        res.status(400).json({ "message": "this email is already exists" });
                    }
                    else {
                        let newMunicipalType;
                        if(userType==='Municipality Analytics'){
                            newMunicipalType= {
                                operationalManager: false,
                                municipal: true,
                                admin: false,
                                recycler: false,
                            };    
                        }
                        else{
                            newMunicipalType= {
                                operationalManager: true,
                                municipal: false,
                                admin: false,
                                recycler: false,
                            }; 
                        }
                      
                        const newUser = new User({
                            name,
                            email,
                            imgUrl,
                            password: bcrypt.hashSync(req.body.password, 8),
                            registerDate: new Date().toLocaleString(),
                            userType: newMunicipalType,
                            city,
                        });
                        newUser.save()
                            .then(result => {
                                infoLogger.info(`Adding user  :${req.body.name} is successfully`);
                                res.json(result);
                            })
                            .catch(err => {
                                errorLogger.error(`Error Adding user `);
                                res.status(400).json({ "message": `Error Adding user ` });
                            });
                    }
                })
                .catch(err => {
                    errorLogger.error(`Error Getting user from db:${err}`);
                    res.status(400).json({ "message": `Error Adding user ` });
                });
        }
        else {
            errorLogger.error("Missing Parameters Please send all Parameters ");
            res.status(400).json({ "message": "Missing Parameters Please send all Parameters" });
        }
    },
    async addReport(req, res) {
        infoLogger.info("Add Report");
    
        const { reason, description, email, phone, binAddress } = req.body;
    
        // Create the email content
        const mailOptions = {
          from: 'creditrecycle@gmail.com',
          to: 'creditrecycle@gmail.com', // Change this to the recipient email address
          subject: 'Report Submission',
          text: `Reason: ${reason}\nDescription: ${description}\nEmail: ${email}\nPhone: ${phone}\nBin Address: ${binAddress}`
        };
    
        // Create the email transporter
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'creditrecycle@gmail.com',
            pass: 'cktxovyrcsrcbvjg'
          }
        });
    
        // Send the email
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            errorLogger.error(`Error sending email: ${error}`);
            res.status(500).json({ message: 'Failed to send email' });
          } else {
            infoLogger.info('Email sent');
            res.json({ message: 'Email sent successfully' });
          }
        });
      },
}
