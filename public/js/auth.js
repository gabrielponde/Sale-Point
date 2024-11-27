// auth.js

// Alterna entre a seção de login e registro
document.getElementById('show-register').addEventListener('click', function(event) {
    event.preventDefault(); // Previne o comportamento padrão do link
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', function(event) {
    event.preventDefault(); // Previne o comportamento padrão do link
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
});

// Lidar com o envio do formulário de login
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o envio do formulário padrão
    // Aqui você pode adicionar sua lógica de autenticação
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Simulação de autenticação, você deve substituir por uma chamada real
    if (email === 'usuario@example.com' && password === 'senha123') {
        alert('Login bem-sucedido!');
        window.location.href = 'home/index.html'; // Redireciona para a pasta home
    } else {
        alert('Email ou senha incorretos!');
    }
});

// Lidar com o envio do formulário de registro
document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o envio do formulário padrão
    // Aqui você pode adicionar sua lógica de registro
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    // Simulação de registro, você deve substituir por uma chamada real
    alert(`Registro bem-sucedido! Bem-vindo, ${name}! Você pode agora fazer login.`);
    
    // Alternar para a seção de login após o registro
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
});
