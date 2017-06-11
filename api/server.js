'use strict';

const Hapi = require('hapi');
const fs = require('fs');

const consoles = JSON.parse(fs.readFileSync('api/data/consoles.json', 'utf8'));
const genres = JSON.parse(fs.readFileSync('api/data/genres.json', 'utf8'));
const videogames = JSON.parse(fs.readFileSync('api/data/videogames.json', 'utf8'));

// Create a server with a host and port
const server = new Hapi.Server({
    connections: {
        routes: {
            cors: true
        }
    }
});

server.connection({
    host: '0.0.0.0',
    port: 8082
});

server.route([{
    method: 'GET',
    path: '/consoles',
    handler: function (request, reply) {
        return reply(consoles);
    }
}, {
    method: 'GET',
    path: '/consoles/{id}',
    handler: function (request, reply) {
        let console = consoles.find(console => console.id === request.params.id);
        if (!console) {
            return reply('Console not found').code(404);
        }
        return reply(console);
    }
}, {
    method: 'POST',
    path: '/consoles',
    handler: function (request, reply) {
        let newConsole = request.payload;
        newConsole.id = parseInt(consoles.map(console => console.id).reverse()[0], 10) + 1;
        consoles.push(newConsole);
        return reply(newConsole);
    }
}, {
    method: 'PUT',
    path: '/consoles/{id}',
    handler: function (request, reply) {
        // TODO: ...
        reply();
    }
}, {
    method: 'DELETE',
    path: '/consoles/{id}',
    handler: function (request, reply) {
        return dbLinks.remove({_id: ObjectId(request.params.linkId)}).then(reply());
    }
}, {
    method: 'GET',
    path: '/videogames',
    handler: function (request, reply) {
        return reply(videogames);
    }
}, {
    method: 'GET',
    path: '/videogames/{id}',
    handler: function (request, reply) {
        let videogame = videogames.find(videogame => videogame.id === request.params.id);
        if (!videogame) {
            return reply('Video game not found').code(404);
        }
        return reply(videogame);
    }
}, {
    method: 'GET',
    path: '/genres',
    handler: function (request, reply) {
        return reply(genres);
    }
}, {
    method: 'GET',
    path: '/genres/{id}',
    handler: function (request, reply) {
        let genre = genres.find(genre => genre.id === request.params.id);
        if (!genre) {
            return reply('Genre not found').code(404);
        }
        return reply(genre);
    }
}]);

const onRequest = function (request, reply) {
    return setTimeout(() => {
        return reply.continue();
    }, 400);
};

server.ext('onRequest', onRequest);

server.register([], (err) => {
    // Start the server
    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
});
