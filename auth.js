
const CHAVE_USUARIO = "verboVersoUsuario";
const CHAVE_LOGIN = "verboVersoLogado";

// Proteção das páginas internas
(function protegerSite() {
    const pagina = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    const paginasPublicas = ["login.html", "cadastro.html"];

    if (!paginasPublicas.includes(pagina)) {
        if (localStorage.getItem(CHAVE_LOGIN) !== "true") {
            const destino = window.location.pathname +
                window.location.search +
                window.location.hash;

            window.location.replace(
                "login.html?next=" + encodeURIComponent(destino)
            );
        }
    }
})();

document.addEventListener("DOMContentLoaded", function () {

    // CADASTRO
    const cadastroForm = document.getElementById("cadastroForm");

    if (cadastroForm) {
        cadastroForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const nome = document.getElementById("nome").value.trim();
            const email = document.getElementById("email").value.trim().toLowerCase();
            const senha = document.getElementById("senha").value;
            const confirmarSenha = document.getElementById("confirmarSenha").value;
            const mensagem = document.getElementById("mensagem");

            mensagem.textContent = "";

            if (senha.length < 4) {
                mensagem.textContent = "A senha deve ter pelo menos 4 caracteres.";
                return;
            }

            if (senha !== confirmarSenha) {
                mensagem.textContent = "As senhas não são iguais!";
                return;
            }

            const usuario = {
                nome: nome,
                email: email,
                senha: senha
            };

            localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
            localStorage.removeItem(CHAVE_LOGIN);

            alert("Conta criada com sucesso! Faça seu login.");

            window.location.href = "login.html";
        });
    }

    // LOGIN
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim().toLowerCase();
            const senha = document.getElementById("senha").value;
            const mensagem = document.getElementById("mensagem");

            mensagem.textContent = "";

            const dadosSalvos = localStorage.getItem(CHAVE_USUARIO);

            if (!dadosSalvos) {
                mensagem.textContent = "Você ainda não possui cadastro. Cadastre-se primeiro.";
                return;
            }

            const usuario = JSON.parse(dadosSalvos);

            if (email !== usuario.email || senha !== usuario.senha) {
                mensagem.textContent = "E-mail ou senha incorretos.";
                return;
            }

            localStorage.setItem(CHAVE_LOGIN, "true");
            localStorage.setItem("verboVersoNome", usuario.nome);

            const parametros = new URLSearchParams(window.location.search);
            const destino = parametros.get("next");

            if (destino) {
                const urlDestino = new URL(destino, window.location.origin);
                const paginaDestino = urlDestino.pathname.split("/").pop().toLowerCase();

                if (
                    urlDestino.origin === window.location.origin &&
                    !["login.html", "cadastro.html"].includes(paginaDestino)
                ) {
                    window.location.href = urlDestino.href;
                    return;
                }
            }

            window.location.href = "index.html";
        });
    }

});

// Sair da conta
function sairDaConta() {
    localStorage.removeItem(CHAVE_LOGIN);
    localStorage.removeItem("verboVersoNome");
    window.location.href = "login.html";
}
