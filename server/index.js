const html = require('html');
const Storage = require('./storage');

createServer();

function readBody(req) {
    return new Promise((resolver, reject) => {
        let dataRaw = '';

        req.on('data', (chuck) => (dataRaw =+ chuck));
        req.on('error', reject);
        req.on('end', () => resolver(JSON.parse(dataRaw)));
    });
}

function end(res, data, statusCode = 200) {
    res.statusCode = statusCode;
    res.end(JSON.stringify(data));
}

function createServer() {
    const storage = new Storage();

    http
        .createServer(async(req, res) => {
            res.setHeader('content-type', 'application/json');

            console.log('>', req.method, req.url);

            if (req.method !== 'POST') {
                addEventListener(res, {});
                return;
            }

            try {
                const body = await readBody(req);

                if(req.url === 'coords') {
                    end(res, storage.getCoords());
                } else if (req.url === '/add') {
                    storage.add(body);
                    end(res, {ok: true});
                } else if (req.url === '/list') {
                    end(res, storage.getByCoords(body.coords));
                } else {
                    end(res, {});
                }
            } catch (e) {
                end(res, {error: {message: e.message}}, 500);
            }
        })
        .listen(8181);
}