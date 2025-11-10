// javascript/login.js

// Corrigido: O 'submit' é no formulário, não no documento
document.getElementById('login-form').addEventListener('submit', async function(event) {
    // Impede o formulário de recarregar a página
    event.preventDefault(); 

    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    const mensagemErro = document.getElementById('mensagem-erro');

    // Limpa erros anteriores
    mensagemErro.textContent = '';

    try {
        // 1. Envia os dados para o seu Back-End
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario: usuario, senha: senha })
        });

        // 2. Recebe a resposta do Back-End
        const data = await response.json();

        // 3. Decide o que fazer
        if (data.sucesso) {
            alert('Login bem-sucedido!');
            // Redireciona o usuário para a página de produtos
            window.location.href = 'produtos.html'; 
        } else {
            // Mostra o erro que o Back-End enviou
            mensagemErro.textContent = data.erro; 
        }

    } catch (error) {
        console.error('Erro ao tentar fazer login:', error);
        mensagemErro.textContent = 'Erro de conexão. Tente mais tarde.';
    }
});
