import initApp from './app';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

initApp().then((app) => {
  if (process.env.NODE_ENV !== 'production') {
    http.createServer(app).listen(process.env.PORT);
    console.log(`Server is listening on port: ${process.env.PORT}`);
  } else {
    const options = {
      key: fs.readFileSync(path.join(__dirname, '../../../certs/client-key.pem')),
      cert: fs.readFileSync(path.join(__dirname, '../../../certs/client-cert.pem')),
    };
    https.createServer(options, app).listen(process.env.HTTPS_PORT);
    console.log(`Server is listening on port: ${process.env.HTTPS_PORT}`);
  }
});
