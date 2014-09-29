var webdriverio = require('webdriverio');
var options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};
webdriverio
    .remote(options)
    .init()
    .url('http://www.facebook.com')
    .title(function(err, res) {
        console.log('Title was: ' + res.value);
    })
    .end();