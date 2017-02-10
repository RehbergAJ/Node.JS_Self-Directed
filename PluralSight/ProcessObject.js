/**
 * process object is default, do not need to 'require'
 * has a collection of stream
 * has attributes to teh current process such as: process.env, process.argv, process.pid, process.title, process.uptime(), process.memoryusage(), process.cwd()
 * process related actions are: process.abort(), process.chdir(), process.kill(), process.setgid(), process.setuid()
 * 
 * An instance of eventEmitter
 * event:'exit'
 * event: 'uncaughtException'
 * 
 */

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk){
    process.stdout.write('Data! -> ' + chunk);
});

process.stdin.on('end', function(){
    process.stderr.write('End!\n');
});

process.on('SIGTERM', function(){
    process.stderr.write("Why are you trying to terminate me?");
});
console.log("Node is running as process #" + process.pid);