var http = require('http');
var express = require('express');

var app = express();

var server = http.createServer(app);
server.listen(process.env.PORT, process.env.IP);

app.use(express.static('public'));

var request = require('request');
var cheerio = require('cheerio');

app.get('/team.json', function(req, res) {
    var options = {
        uri: 'http://get.hudl.com/about/team/',
        gzip: true
    };
    
    request(options, function (error, response, body) {
        if (error) return res.status(500).send(error);
        
        if (response.statusCode == 200) {
            var $ = cheerio.load(body);
            
            var $members = $('section .team-photos .col12');
            
            var members = $members.map(function(i, el) {
                var $member = $(el);
                
                return {
                    name: $member.find('h6').text(),
                    pic: $member.find('img').attr('src'),
                    title: $member.find('.job-title').text(),
                    quote: $member.find('.one-liner').text()
                };
            }).get();
            
            return res.json(members);
        }
        
        return res.status(500);
    });
});