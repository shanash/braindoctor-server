import express from 'express';
import routes, { api } from './routes';

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', api);
app.use(routes);

app.use(function (error, req, res, next) {
  res.status(404).send(error.status + ' Error : ' + error.message);
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
