// guardar usuário logado no localStorage
// não deixar o usuário acessar a aplicação sem um username
function onLoginClick(event) {
  var user = $('input[name=username]').val();
  console.log(user);

  if (!user || user === '') {
    alert('Você deve informar um nome de usuário!');
    event.preventDefault();
    return;
  }

  localStorage.setItem('user', user);
}