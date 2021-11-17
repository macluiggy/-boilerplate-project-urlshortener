import express from 'express';
import ApiController from './api.controller';

const router = express.Router()

//   app.get('/api/hello', function<NoSeUsa>(_: NoSeUsa, res: ApiHelloResponse<string>) {
//     //res.json({ greeting: process.cwd(), a: __dirname });
//     res.json({ greeting: 'hello API' });
//   });
router.route('/hello')
        .get(ApiController.apiGetHelloMessage)

module.exports = router