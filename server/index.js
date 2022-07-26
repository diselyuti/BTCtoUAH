const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs/promises');
const constants = require('./constants');

const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const {CLIENT_SECRET, CLIENT_ID, REFRESH_TOKEN, USER_EMAIL} = require("./constants");
const OAuth2 = google.auth.OAuth2;
const OAuth2_client = new OAuth2(CLIENT_ID, CLIENT_SECRET)
OAuth2_client.setCredentials({
    refresh_token: REFRESH_TOKEN
});

async function send_mail(rate, recipients){
    const accessToken = OAuth2_client.getAccessToken();

    const transport = nodemailer.createTransport({
       service: 'gmail',
       auth:{
           type: 'OAuth2',
           user: USER_EMAIL,
           clientId: CLIENT_ID,
           clientSecret: CLIENT_SECRET,
           refreshToken: REFRESH_TOKEN,
           accessToken: accessToken,
       }
    });

    const mailOptions = {
        from: `BTC to UAH service <${USER_EMAIL}>`,
        to: recipients.map(recipient => recipient.email + ', '),
        subject: 'Current BTC to UAH rate',
        html: `<h3>1BTC = ${rate}UAH</h3>`,
    }

    return transport.sendMail(mailOptions);
}

async function contact(email, text){
    const accessToken = OAuth2_client.getAccessToken();

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            type: 'OAuth2',
            user: USER_EMAIL,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
        }
    });

    const mailOptions = {
        from: `BTC to UAH service <${USER_EMAIL}>`,
        to: USER_EMAIL,
        subject: `${email} wants to contact with you!`,
        html: `<h3>${text}</h3>`,
    }

    return transport.sendMail(mailOptions);
}

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello there)');
});

app.get('/rate', async (req, res) => {
    try{
        let stats = await axios.get(constants.PRICE_CHANGE_STATISTICS_24H);
        let statsDataJSON = JSON.stringify(stats.data[0][0]);
        res.send(statsDataJSON);
    }catch (err){
        res.status(400).send({message: 'Invalid status value'});
        console.log(err);
    }
});

app.post('/subscribe', async (req, res) => {
    try{
        let body = req.body;
        let emailsJSON = await fs.readFile(constants.EMAILS_PATH, { encoding: 'utf8' });
        if (!emailsJSON.length) emailsJSON = '[]';
        let emails = JSON.parse(emailsJSON);
        let isExist = emails.find(element => element.email === body.email);
        if (isExist){
            res.status(409).send({
                message: 'This email already exists'
            });
            console.log('Email already exists');
        }else{
            emails.push({
                email: body.email,
            });
            emailsJSON = JSON.stringify(emails);
            await fs.writeFile(constants.EMAILS_PATH, emailsJSON);
            res.status(200).send({
                message: 'Email added successfully'
            });
            console.log('Email added successfully');
        }
    }catch (err){
        console.log(err);
        res.status(500).send({message: 'Internal Server Error'});
    }
});

app.post('/sendEmails', async (req, res) => {
    try{
        let emailsJSON = await fs.readFile(constants.EMAILS_PATH, { encoding: 'utf8' });
        if (!emailsJSON.length) emailsJSON = '[]';
        let emails = JSON.parse(emailsJSON);
        if (!emails.length) {
            res.status(409).send({message: 'Add emails to send newsletters to'});
            return;
        }
        let stats = await axios.get(constants.PRICE_CHANGE_STATISTICS_24H);
        let info = await send_mail(stats.data[0][0], emails);
        console.log("Sended emails info: ", info);
        res.status(200).send({message: 'Emails sent'});
    }catch (err){
        console.log(err);
        res.status(500).send({message: 'Internal Server Error'});
    }
});

app.post('/contact', async (req, res) => {
    try{
        let body = req.body;
        let info = contact(body.email, body.text);
        console.log("Contact: ", info);
        res.status(200).send({message: 'Thank you for contact!'});
    }catch (err){
        console.log(err);
        res.status(500).send({message: 'Internal Server Error'});
    }
});

app.listen('3001', () => { })