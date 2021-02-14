// o usuário será armazenado aqui
var user;

// conectar no socket
var socket = io('http://localhost:3333');

// quando carregar a página, a aplicação tentará recuperar o usuário do localStorage
// se não houver usuário, será redirecionado para a página inicial
function loadUser() {
  user = localStorage.getItem('user');

  if (!user) {
    window.location.href = '/';
  }

  document.getElementById('username').value = user;
}

// função para renderizar a mensagem na tela utilizando jQuery
function renderMessage(message) {
  $('.messages')
    .append(
      '<div class="message"><strong>'
      + message.author
      + '</strong>: '
      + message.message
      + '</div>');
}

// ouvir o evento 'receivedMessage' enviado pelo backend
// para saber quando o frontend deve renderizar uma nova mensagem
socket.on('receivedMessage', (message) => {
  renderMessage(message);
});

// ouvir o evento 'previousMessages' enviado pelo backend
// para conseguir carregar as mensagem já armazenadas
socket.on('previousMessages', (messages) => {
  messages.forEach(message => {
    renderMessage(message);
  });
});

// envio de mensagens
$('#chat').submit((event) => {
  event.preventDefault();

  // armazenar o autor e a mensagem 
  var author = user;
  var message = $('input[name=message]').val();

  // verificação simples para evitar que as variáveis acima estejam vazias 
  if (author.length && message.length) {
    // enviar um objeto pelo websocket 
    var messageObject = {
      author,
      message,
    };
  }

  // logo ao fazer o envio da mensagem, ele fará a renderização da mesma na tela
  renderMessage(messageObject);

  // enviar os dados passando o nome do evento (pode ser qualquer nome) e o dado
  socket.emit('sendMessage', messageObject);
});