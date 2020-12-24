export default (express,bodyParser,createReadStream,crypto,http)=>{
    const CORS = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers':
            'x-test,Content-Type,Accept, Access-Control-Allow-Headers',
    }
        const app = express();
    app
        .use((req, res, next) => {
        res.set(CORS);
        next();
        })
        .get('/login/', (req, res) => res.send('ta1jin'))
        .get('/code/', (req, res) => {
                res.set({ 'Content-Type': 'text/plain; charset=utf-8' });
                createReadStream(import.meta.url.substring(7)).pipe(res);
            })
        .get('/sha1/:input', r => {
            const shasum = crypto.createHash('sha1');
            shasum.update(r.params.input);
            r.res.send(shasum.digest('hex'));
        })
        .all('/req/', (req, res) => {
                let url = req.method === 'POST' ? req.body.addr : req.query.addr;

                http.get(url, (response) => {
                    let data = '';
                    response.on('data', (chunk) => (data += chunk));
                    response.on('end', () => {
                        res
                            .set({
                                'Content-Type': 'text/plain; charset=utf-8',
                            })
                            .end(data);
                    });
                });
            })
        .all('*', (req, res) => {
                res.send('ta1jin');
            })
            .use((error, req, res, next) =>
                res.status(500).set(CORS).send('Error')
            );
        return app;
    }
