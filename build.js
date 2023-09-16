import { NwBuilder} from "nw-builder";
var nw = new NwBuilder({
    files: './path/to/nwfiles/**/**', // use the glob format
    platforms: ['osx64', 'win32', 'win64', 'linux32', 'linux64'],
    version: 'latest',
    argv: ['<nwjs_arg>',] // see nwjs docs for possible <nwjs_arg> values
});

// Log stuff you want
nw.on('log',  console.log);

nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});