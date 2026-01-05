/* =======================
   PROTEÇÃO ADMIN
======================= */
if (window.location.pathname.includes("admin.html")) {
    if (localStorage.getItem("adminLogado") !== "true") {
        window.location.href = "index.html";
    }
}

/* =======================
   PRODUTOS
======================= */
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

function salvar() {
    localStorage.setItem("produtos", JSON.stringify(produtos));
}

/* =======================
   ELEMENTOS DO DOM
======================= */
const listaProdutos = document.getElementById("listaProdutos"); // usado na index
const listaAdminProdutos = document.getElementById("listaAdminProdutos"); // lista no admin
const tituloInput = document.getElementById("titulo");
const precoInput = document.getElementById("preco");
const descricaoInput = document.getElementById("descricao");
const categoriaInput = document.getElementById("categoria");
const inputImagem = document.getElementById("imagem");
const previewImagem = document.getElementById("previewImagem");
let imagemBase64 = "";

/* =======================
   RENDERIZAR INDEX
======================= */
function renderizar() {
    if (!listaProdutos) return;

    const busca = document.getElementById("busca")?.value.toLowerCase() || "";
    const filtro = document.getElementById("filtroCategoria")?.value || "";

    listaProdutos.innerHTML = "";

    produtos
        .filter(p => p.titulo.toLowerCase().includes(busca) && (filtro === "" || p.categoria === filtro))
        .forEach((p, index) => {
            const div = document.createElement("div");
            div.className = "produto";

            div.dataset.titulo = p.titulo;
            div.dataset.descricao = p.descricao;
            div.dataset.preco = p.preco;
            div.dataset.imagem = p.imagem;

            div.innerHTML = `
                <img src="${p.imagem}">
                <div class="info">
                    <h3>${p.titulo}</h3>
                    <p class="preco">R$ ${p.preco}</p>
                    ${localStorage.getItem("adminLogado") === "true" ? `<button class="btn-excluir">Excluir</button>` : ""}
                </div>
            `;

            // abrir modal ao clicar no card
            div.addEventListener("click", () => abrirModalProduto(div));

            // botão excluir (admin)
            if (localStorage.getItem("adminLogado") === "true") {
                const btnExcluir = div.querySelector(".btn-excluir");
                if (btnExcluir) {
                    btnExcluir.addEventListener("click", e => {
                        e.stopPropagation();
                        excluirProduto(index);
                    });
                }
            }

            listaProdutos.appendChild(div);
        });
}

/* =======================
   RENDERIZAR ADMIN
======================= */
function renderizarAdmin() {
    if (!listaAdminProdutos) return;

    listaAdminProdutos.innerHTML = "";

    produtos.forEach((p, index) => {
        const div = document.createElement("div");
        div.className = "admin-produto-card";

        div.innerHTML = `
            <div class="info-card">
                <img src="${p.imagem}">
                <div class="detalhes">
                    <h4>${p.titulo}</h4>
                    <p>R$ ${p.preco}</p>
                </div>
            </div>
            <div class="acoes-card">
                <button class="editar">Editar</button>
                <button class="excluir">Excluir</button>
            </div>
        `;

        // Editar produto
        div.querySelector(".editar").addEventListener("click", () => {
            tituloInput.value = p.titulo;
            precoInput.value = p.preco;
            descricaoInput.value = p.descricao;
            categoriaInput.value = p.categoria;
            imagemBase64 = p.imagem;
            if (previewImagem) {
                previewImagem.src = imagemBase64;
                previewImagem.style.display = "block";
            }

            produtos.splice(index, 1);
            salvar();
            renderizar();
            renderizarAdmin();
        });

        // Excluir produto
        div.querySelector(".excluir").addEventListener("click", () => {
            if (confirm("Deseja realmente excluir este anúncio?")) {
                produtos.splice(index, 1);
                salvar();
                renderizar();
                renderizarAdmin();
            }
        });

        listaAdminProdutos.appendChild(div);
    });
}

/* =======================
   ADICIONAR PRODUTO
======================= */
function adicionarProduto() {
    if (!tituloInput) return;

    const titulo = tituloInput.value.trim();
    const preco = precoInput.value.trim();
    const descricao = descricaoInput.value.trim();
    const categoria = categoriaInput.value;

    if (!titulo || !preco || !descricao || !imagemBase64) {
        alert("Preencha todos os campos e selecione uma imagem");
        return;
    }

    produtos.push({ titulo, preco, imagem: imagemBase64, descricao, categoria });
    salvar();
    renderizar();
    renderizarAdmin();

    tituloInput.value = "";
    precoInput.value = "";
    descricaoInput.value = "";
    imagemBase64 = "";
    if (previewImagem) {
        previewImagem.src = "";
        previewImagem.style.display = "none";
    }

    alert("Anúncio criado com sucesso ✅");
}

/* =======================
   EXCLUIR PRODUTO
======================= */
function excluirProduto(index) {
    if (!confirm("Deseja excluir este produto?")) return;
    produtos.splice(index, 1);
    salvar();
    renderizar();
    renderizarAdmin();
}

/* =======================
   UPLOAD DE IMAGEM
======================= */
if (inputImagem) {
    inputImagem.addEventListener("change", () => {
        const file = inputImagem.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            imagemBase64 = reader.result;
            if (previewImagem) {
                previewImagem.src = imagemBase64;
                previewImagem.style.display = "block";
            }
        };
        reader.readAsDataURL(file);
    });
}

/* =======================
   LOGIN / LOGOUT ADMIN
======================= */
const SENHA_ADMIN = "1234";

function loginAdmin() {
    const senha = document.getElementById("adminSenha")?.value;
    if (senha === SENHA_ADMIN) {
        localStorage.setItem("adminLogado", "true");
        window.location.href = "admin.html";
    } else alert("Senha incorreta");
}

function logoutAdmin() {
    localStorage.removeItem("adminLogado");
    window.location.href = "index.html";
}

/* =======================
   MENU HAMBURGUER
======================= */
document.addEventListener("DOMContentLoaded", () => {
    const btnMenu = document.getElementById("btnMenu");
    const menu = document.getElementById("menu");
    const btnAdmin = document.getElementById("btnAdmin");
    const adminBox = document.getElementById("adminBox");
    const btnEntrarAdmin = document.getElementById("btnEntrarAdmin");

    if (btnMenu) btnMenu.addEventListener("click", () => {
        btnMenu.classList.toggle("active");
        menu.classList.toggle("active");
    });

    if (btnAdmin) btnAdmin.addEventListener("click", e => {
        e.preventDefault();
        adminBox.style.display = adminBox.style.display === "block" ? "none" : "block";
    });

    if (btnEntrarAdmin) btnEntrarAdmin.addEventListener("click", loginAdmin);

    renderizar();
    renderizarAdmin();
});

/* =======================
   MODAL
======================= */
const modal = document.getElementById("modal");
const btnFechar = document.getElementById("btnFechar");

function abrirModalProduto(el) {
    if (!modal) return;
    modal.style.display = "flex";
    document.getElementById("modalImg").src = el.dataset.imagem;
    document.getElementById("modalTitulo").innerText = el.dataset.titulo;
    document.getElementById("modalDesc").innerText = el.dataset.descricao;
    document.getElementById("modalPreco").innerText = "R$ " + el.dataset.preco;
    document.getElementById("modalZap").href = `https://wa.me/5500000000000?text=Tenho%20interesse%20no%20produto:%20${encodeURIComponent(el.dataset.titulo)}`;
}

if (btnFechar) btnFechar.addEventListener("click", () => {
    modal.style.display = "none";
});

if (modal) modal.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
});
