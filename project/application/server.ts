// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode, ValueProvider } from '@angular/core';

import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as nodeMailer from 'nodemailer';
import * as bodyParser from 'body-parser';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./tmp/server/main');
const isBot = require('isbot');

// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { renderModuleFactory } from '@angular/platform-server';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';

// Our index.html we'll use as our template
const template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();
const domino = require('domino');
const win = domino.createWindow(template);

global['window'] = win;
global['document'] = win.document;

app.engine('html', (_, options, callback) => {
    renderModuleFactory(AppServerModuleNgFactory, {
        // Our index.html
        document: template,
        url: options.req.url,
        extraProviders: [
            provideModuleMap(LAZY_MODULE_MAP),
            // make req and response accessible when angular app runs on server
            <ValueProvider>{
                provide: REQUEST,
                useValue: options.req,
            },
            <ValueProvider>{
                provide: RESPONSE,
                useValue: options.req.res,
            },
        ],
    }).then(html => {
        callback(null, html);
    });
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/api/send-email', (req, res) => {
    const { emailSendConfig, emailTo, subject, body } = req.body;
    const { authHost, authPort, authUser, authPass, emailFrom } = emailSendConfig;
    let transporter = nodeMailer.createTransport({
        host: authHost,
        port: authPort,
        auth: {
            user: authUser,
            pass: authPass,
        },
    });

    let mailOptions = {
        from: emailFrom,
        to: emailTo,
        subject,
        html: body,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send({ text: 'Fail' });
        }

        return res.status(200).send({ text: 'Success' });
    });
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
    global['navigator'] = req['headers']['user-agent'];
    const userAgent = req['headers']['user-agent'];

    req['headers']['crawler'] = false;
    if (isBot(userAgent) === true) {
        req['headers']['crawler'] = true;
    }

    res.render(join(DIST_FOLDER, 'browser', 'index.html'), { req });
});

// Start up the Node server
app.listen(PORT, () => {
    console.log(`Node server listening on http://localhost:${PORT}`);
});
