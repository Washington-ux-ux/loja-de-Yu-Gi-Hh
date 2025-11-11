// javascript/login.js

document.addEventListener('DOMContentLoaded', function() {
    
    // Seleciona os formulários e links
    const loginForm = document.getElementById('login-form');
    const registroForm = document.getElementById('registro-form');
    const linkRegistro = document.getElementById('link-registro');
    const linkLogin = document.getElementById('link-login');

    // Seleciona as caixas de mensagem
    const msgErroLogin = document.getElementById('mensagem-erro-login');
    const msgErroRegistro = document.getElementById('mensagem-erro-registro');
    const msgSucessoRegistro = document.getElementById('mensagem-sucesso-registro');

    // --- LÓGICA PARA TROCAR DE FORMULÁRIO ---

    // Quando clicar em "Registre-se"
    linkRegistro.addEventListener('click', function(event) {
        event.preventDefault(); // Impede o link de navegar
        loginForm.classList.add('hidden');
        registroForm.classList.remove('hidden');
        msgErroLogin.textContent = ''; // Limpa erros
    });

    // Quando clicar em "Faça login"
    linkLogin.addEventListener('click', function(event) {
        event.preventDefault();
        registroForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        msgErroRegistro.textContent = ''; // Limpa erros
        msgSucessoRegistro.textContent = ''; // Limpa sucesso
    });

    // --- LÓGICA DE LOGIN (EXISTENTE) ---
    
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 

        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;
        
        msgErroLogin.textContent = ''; // Limpa erros anteriores

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario: usuario, senha: senha })
            });
            const data = await response.json();

            if (data.sucesso) {
                alert('Login bem-sucedido!');
                window.location.href = 'produtos.html'; 
            } else {
                msgErroLogin.textContent = data.erro; 
            }
        } catch (error) {
            console.error('Erro no login:', error);
            msgErroLogin.textContent = 'Erro de conexão. Tente mais tarde.';
        }
    });

    // --- LÓGICA DE REGISTRO (NOVA) ---

    registroForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const usuario = document.getElementById('usuario-registro').value;
        const senha = document.getElementById('senha-registro').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;

        // Limpa mensagens
        msgErroRegistro.textContent = '';
        msgSucessoRegistro.textContent = '';

        // 1. Validação no Front-End
        if (senha !== confirmarSenha) {
            msgErroRegistro.textContent = 'As senhas não coincidem.';
            return;
        }
        if (senha.length < 6) {
            msgErroRegistro.textContent = 'A senha deve ter pelo menos 6 caracteres.';
            return;
        }

        // 2. Envia para o Back-End
        try {
            const response = await fetch('http://localhost:3000/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario: usuario, senha: senha })
            });
            const data = await response.json();

            if (data.sucesso) {
                msgSucessoRegistro.textContent = 'Conta criada! Você já pode fazer login.';
                // Opcional: Limpar os campos após o sucesso
                registroForm.reset(); 
            } else {
                // Mostra o erro vindo do servidor (ex: "Usuário já existe")
                msgErroRegistro.textContent = data.erro;
            }
        } catch (error) {
            console.error('Erro no registro:', error);
            msgErroRegistro.textContent = 'Erro de conexão. Tente mais tarde.';
        }
    });
});