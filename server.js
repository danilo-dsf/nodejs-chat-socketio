const express = require('express');
const path = require('path');

const app = express();
//definindo o protocolo http
const server = require('http').createServer(app);
//definindo o protocolo wss para o websocket
const io = require('socket.io')(server);

//definir uma pasta onde ficarão os arquivos públicos a serem acessados pela aplicação
//onde ficarão os arquivos frontend da aplicação
app.use(express.static(path.join(__dirname, 'public')));
//definindo que os arquivps frontend da aplicação serão HTML em vez de EJS
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html');

//quando o usuário acessar a rota padrão "/", irá renderizar o arquivo index.html
app.use('/', (req, res) => {
  res.render('index.html');
});

// array de mensagens para armazenar as mensagens enviadas
// caso a aplicação tenha um banco de dados, essas mensagens
// poderão ser salvas no banco
let messages = [];

//definir forma de conexão do servidor com o websocket
io.on('connection', socket => {
  // assim que o socket conectar na aplicação
  // enviaremos, para ele, as mensagens já armazenadas no servidor
  socket.emit('previousMessages', messages);

  // receber os dados enviados pelo MESMO evento enviado pelo frontend
  // e armazenar os dados "data" e fazer a tratativa necessária pela arrow function
  socket.on('sendMessage', data => {
    // armazenei a mensagem enviada no array de mensagens
    messages.push(data);
    // avisar o frontend que ele precisa renderizar a nova mensagem
    socket.broadcast.emit('receivedMessage', data);
  });
});

//o servidor ouvirá a porta 3333
server.listen(3333, () => {
  console.log('Servidor iniciado na porta 3333');
})