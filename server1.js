const express = require('express');
const morgan = require('morgan');
const got = require ('got');
const cors = require('cors');

require('dotenv').config();
const app = express();


const { router } = require('./booksRouter');

//process.ENV
const PORT = process.env.PORT || 8081;
const thirdPartyBaseUrl = 'http://api.weatherbit.io/v2.0/current';
const thirdPartyApiKey = process.env.WETHER_API_KEY;


app.use(express.json());
app.use(express.urlencoded({extended: true})); // чтобы распарсить html формы
app.use(express.static('public')); //можно получить доступ к директории, сделав ее публичной
app.use(morgan('tiny'));
app.use(cors());




app.get('/api/weather', async (req, res ) => {
    try {
        const {
            latitude,
            longtitude
        } = req.query;

        if(!latitude){
           return res.status(400).json({message: 'latitude parameter is mandatory'})
        };
        if(!longtitude){
           return res.status(400).json({message: 'longtitude parameter is mandatory'})
        }
        const response = await got(thirdPartyBaseUrl, {
            searchParams: {
                key: thirdPartyApiKey,
                lat: latitude,
                lon: longtitude,
                
            },
            responseType: 'json'
        });
        const [weatherData] = response.body.data;
        const {
            city_name,
            weather: { description }, // same as const description = weatherData.weather.description
            temp
        } = weatherData;
        res.json({
            city_name,
            description,
            temp
        });
    } catch(err){
        res.status(500).json({message: err.message})
    } 
})

app.listen(PORT, (err) => {
        if(err){
            console.error('Error at server launch:', err);
        }
        console.log(`Server works at port ${PORT}`);
    });