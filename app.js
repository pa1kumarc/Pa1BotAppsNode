var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3979, function(){
   console.log('%s listening to %s', server.name, server.url) ;
});
server.get(/.*/, restify.serveStatic({ 'directory': '.', 'default': 'index.html' }));

var connector = new builder.ChatConnector({
   appId: process.env.MICROSOFT_APP_ID,
   appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var DialogLables = {
    
  Yes:'yes',
  No:'no',
  Other:'hello'
};
var bot = new builder.UniversalBot(connector, [
    function (session){
        
        builder.Prompts.choice(
            session,
            'Hello!! Do you like me?',
            [DialogLables.Yes, DialogLables.No],
            {
                maxRetries: 3,
                retryPrompt: 'Not a valid option'
            });
    },
    function (session, result){
       
        if(!result.response){
            session.send('Oops!! too many attempts');
            return session.endDialog();
        }
        else{
           var selection = result.response.entity;
           if (selection == DialogLables.Yes){
                 session.send('Wow!! Thanks for liking me.');     
            }
            else {
                session.send('Thats ok!! No problem buddy') ;     
            }
        }
    }
]);

