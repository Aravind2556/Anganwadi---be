const Express = require('express')
const UserModel = require('../models/AdminAccount')
const isAuth = require('../middleware/isAuth')
const StudentModel = require('../models/UserAccount')

const AuthRouter = Express.Router()


AuthRouter.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Login called:", email, password);
  
      if (!email || !password) {
        return res.send({ success: false, message: 'Please provide all details!' });
      }
  
      // First, check if the user is an admin or a student
      let user = await UserModel.findOne({ email });
  
      // If not found in UserModel, check in StudentModel
      if (!user) {
        user = await StudentModel.findOne({ email });
      }
  
      if (!user) {
        return res.send({ success: false, message: 'Invalid Email!' });
      }
  
      // Validate password
      if (user.password !== password) {
        return res.send({ success: false, message: 'Invalid Password!' });
      }
  
      // Set session data
      req.session.user = {
        studentId: user.studentId,
        fullname: user.fullname,
        email: user.email,
        contact: user.contact,
        role: user.role
      };
  
      req.session.save((err) => {
        if (err) {
          return res.send({ success: false, message: 'Failed to create session!' });
        }
  
        return res.send({ success: true, message: 'Logged in successfully!', user: req.session.user });
      });
  
    } catch (err) {
      console.log("Error in login:", err);
      return res.send({ success: false, message: 'Trouble in login! Please contact support team.' });
    }
  });

  

  
AuthRouter.post('/register', async (req, res)=>{
    try{
        const {fullname, email, contact, password ,confirmPassword,userType} = req.body

        console.log("reg:",fullname, email, contact, password ,confirmPassword,userType)


        if(!fullname || !email || !contact || !password || !confirmPassword || !userType){
            return res.send({success: false, message: 'Please provide all details!'})
        }
        if(confirmPassword !== password){
            return res.send({success : false , message : "Passwords do not match!"})
            
        }
        
        const fetchUser = await UserModel.findOne({email: email.toLowerCase()})
        if(fetchUser){
            return res.send({success: false, message: 'Account already exist! Please try login.'})
        }

        let Users = await UserModel.find({});
        let userId;
        if(Users.length>0){
            let last_user = Users.slice(-1)[0];
            userId = last_user.Angenid+1;
        }else{ 
            userId = 1
        }

        const newUser = new UserModel({
            Angenid: userId,
            fullname: fullname,
            email: email,
            contact: contact,
            password: password,
            role : userType
        })

        const saveUser = await newUser.save()

        if(saveUser){
             return res.send({success: true, message: "Admin id Registration successfully!"})
            }
        else{
            return res.send({success: false, message: 'Failed to create User!'})
        }

    }
    catch(err){
        console.log("Error in Register:",err)
        return res.send({success: false, message: 'Trouble in Registration! Please contact admin.'})
    }
})


AuthRouter.post('/register-student', async (req, res)=>{
    try{
        const {fullname, email, contact, password ,userType,address,Dob,Angenid} = req.body

        console.log("reg:",fullname, email, contact, password ,userType,address,Dob,Angenid)
        
        
        if(!fullname || !email || !contact || !password  || !userType || !address || !Dob || !Angenid){
            return res.send({success: false, message: 'Please provide all details!'})
        }

        
        const fetchUser = await StudentModel.findOne({email: email.toLowerCase()})
        if(fetchUser){
            return res.send({success: false, message: 'Account already exist! Please try login.'})
        }

        let userId;
        const lastUser = await StudentModel.findOne().sort({ studentId: -1 }); // Fetch the last created student
        if (lastUser) {
            // Extract the numerical part from the last studentId
            const lastNumber = parseInt(lastUser.studentId.replace('VCEW', ''), 10);
            userId = `VCEW${lastNumber + 1}`; // Increment the number and append to the prefix
        } else {
            userId = 'VCEW1'; // Start from VCEW1 if no students exist
        }

        const newUser = new StudentModel({
            studentId : userId,
            Angenid : Angenid,
            fullname: fullname,
            email: email,
            contact: contact,
            dateOfBirth : Dob,
            address : address ,
            password: password,
            role : userType
        })

        const saveUser = await newUser.save()

        if(saveUser){
            return res.send({success: true, message: "User Registration successfully!"})
        }
        else{
            return res.send({success: false, message: 'Failed to create User!'})
        }

    }
    catch(err){
        console.log("Error in Register:",err)
        return res.send({success: false, message: 'Trouble in Registration! Please contact admin.'})
    }
})


AuthRouter.get('/checkauth', async (req, res) => {
    try {
      console.log("User valid", req.session);
  
      // Check if user is authenticated via session
      if (req.session.user) {
        // Fetch user data from UserModel (admin)
        const fetchadmin = await UserModel.findOne({ email: req.session.user.email.toLowerCase() }).select("-password -_id");
        
        if (fetchadmin) {
          // If the user is an admin, return the admin data
          return res.send({ success: true, user: fetchadmin, message: "Successfully fetched the current logged-in admin!" });
        }
  
        // Fetch user data from StudentModel (student)
        const fetchuser = await StudentModel.findOne({ email: req.session.user.email.toLowerCase() }).select("-password -_id");
  
        if (fetchuser) {
          // If the user is a student, return the student data
          return res.send({ success: true, user: fetchuser, message: "Successfully fetched the current logged-in student!" });
        }
  
        // If user is not found in either model
        return res.send({ success: false, message: 'User not found!' });
      } else {
        return res.send({ success: false, message: "No login detected! Please login and try again." });
      }
    } catch (err) {
      console.log("Error in Checking Authentication:", err);
      return res.send({ success: false, message: 'Trouble in Checking Authentication! Please contact the support team.' });
    }
  });
  


AuthRouter.get('/logout', async(req, res)=>{
    try{
        console.log("logout called:",req.session.user)
        if(req.session.user){
            req.session.destroy((err) => {
                if (err) {
                    console.log("Error in destroying session:", err);
                    return res.send({ success: false, message: "Failed to log out! Please contact developer." });
                }
                return res.send({ success: true, message: "Logged out successfully!" });
            });            
        }
        else{
            return res.send({success: false, message: "Please login and try again later!"})
        }
    }
    catch(err){
        console.log("Trouble in logging out:",err)
        return res.send({success: false, message: "Trouble in logging out! Please contact support Team."})
    }
})


module.exports = AuthRouter