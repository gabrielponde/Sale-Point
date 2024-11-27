// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Função para alternar entre a seção de login e registro
    document.getElementById('show-register').addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('register-section').style.display = 'block';
        document.getElementById('login-section').style.display = 'none';
    });

    document.getElementById('show-login').addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('register-section').style.display = 'none';
    });

    // Função para registro de usuário
    document.getElementById('register-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('http://localhost:3333/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao registrar usuário');
            }
            
            alert('Usuário registrado com sucesso!');
            // Redireciona para a página de login
            document.getElementById('register-section').style.display = 'none';
            document.getElementById('login-section').style.display = 'block';
        } catch (error) {
            alert(error.message);
        }
    });

    // Função para login do usuário
    document.getElementById('login-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('http://localhost:3333/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao fazer login');
            }

            alert('Login realizado com sucesso!');
            // Redireciona para a página principal ou dashboard
            window.location.href = '../pages/home.html'; // Certifique-se de que este caminho está correto
        } catch (error) {
            alert(error.message);
        }
    });

    // Função para redefinir a senha
    document.getElementById('reset-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('reset-email').value;
        const newPassword = document.getElementById('new-password').value;

        try {
            const response = await fetch('http://localhost:3333/user/reset', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password: newPassword })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao redefinir a senha');
            }

            alert('Senha redefinida com sucesso!');
            // Redireciona para a página de login
            document.getElementById('reset-section').style.display = 'none';
            document.getElementById('login-section').style.display = 'block';
        } catch (error) {
            alert(error.message);
        }
    });

    // Função para editar informações do usuário
    document.getElementById('edit-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('edit-name').value;
        const email = document.getElementById('edit-email').value;

        try {
            const response = await fetch('http://localhost:3333/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Assumindo que o token está salvo no localStorage
                },
                body: JSON.stringify({ name, email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao editar informações do usuário');
            }

            alert('Informações do usuário atualizadas com sucesso!');
            // Redireciona para a página principal ou dashboard
            window.location.href = '../pages/home.html'; // Certifique-se de que este caminho está correto
        } catch (error) {
            alert(error.message);
        }
    });
});
