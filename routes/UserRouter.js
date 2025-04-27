const Express = require('express')
const StudentModel = require('../models/UserAccount')
const axios = require('axios');


const UserRouter = Express.Router()

UserRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await StudentModel.findOne({ email, password });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Filter this_sepkala: 1 data
        const filteredData = await StudentModel.find({ _id: user._id, this_sepkala: 1 });

        // Fetch Thingspeak API data
        const thingspeakURL = 'https://api.thingspeak.com/channels/2877835/feeds.json?api_key=X6W35RACSZEL05QJ';
        const thingspeakResponse = await axios.get(thingspeakURL);

        // Extract field1 data
        const thingspeakData = thingspeakResponse.data.feeds.map(feed => ({
            created_at: feed.created_at,
            value: feed.field1
        }));

        res.status(200).json({ user, chartData: filteredData, thingspeakData });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


UserRouter.get('/fetch-Data',async (req,res)=>{
    if(req.session.user){
        const userid = await StudentModel.findOne({  studentId : req.session.user.id}) 
        if(userid){

        }
    }
else{
}


})

module.exports = UserRouter;











module.exports = UserRouter