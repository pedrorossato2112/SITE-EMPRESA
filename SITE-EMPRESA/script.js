/* =======================
   PRODUTOS
======================= */

let produtos = JSON.parse(localStorage.getItem("produtos")) || []

const tituloInput = document.getElementById("titulo")
const precoInput = document.getElementById("preco")
const imagemInput = document.getElementById("imagem")
const descricaoInput = document.getElementById("descricao")
const categoriaInput = document.getElementById("categoria")
const listaProdutos = document.getElementById("listaProdutos")

function salvar() {
    localStorage.setItem("produtos", JSON.stringify(produtos))
}

function renderizar() {
    const busca = document.getElementById("busca")?.value.toLowerCase() || ""
    const filtro = document.getElementById("filtroCategoria")?.value || ""

    listaProdutos.innerHTML = ""

    produtos
        .filter(p =>
            p.titulo.toLowerCase().includes(busca) &&
            (filtro === "" || p.categoria === filtro)
        )
        .forEach((p, index) => {
            listaProdutos.innerHTML += `
                <div class="produto">
                    <img src="${p.imagem}">
                    <div class="info">
                        <h3>${p.titulo}</h3>
                        <p class="preco">R$ ${p.preco}</p>
                        ${localStorage.getItem("adminLogado") === "true"
                            ? `<button class="btn-excluir" onclick="excluirProduto(${index})">Excluir</button>`
                            : ""}
                    </div>
                </div>
            `
        })
}

function adicionarProduto() {
    const titulo = tituloInput.value.trim()
    const preco = precoInput.value.trim()
    const imagem = imagemInput.value.trim()
    const descricao = descricaoInput.value.trim()
    const categoria = categoriaInput.value

    if (!titulo || !preco || !imagem || !descricao) {
        alert("Preencha todos os campos")
        return
    }

    produtos.push({ titulo, preco, imagem, descricao, categoria })

    salvar()
    renderizar()

    tituloInput.value = ""
    precoInput.value = ""
    imagemInput.value = ""
    descricaoInput.value = ""
}

function excluirProduto(index) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return
    produtos.splice(index, 1)
    salvar()
    renderizar()
}

/* =======================
   MODAL
======================= */

const modal = document.getElementById("modal")
const modalImg = document.getElementById("modalImg")
const modalTitulo = document.getElementById("modalTitulo")
const modalDesc = document.getElementById("modalDesc")
const modalPreco = document.getElementById("modalPreco")
const modalZap = document.getElementById("modalZap")

function abrirModal(t, d, p, i) {
    modal.style.display = "flex"
    modalImg.src = i
    modalTitulo.innerText = t
    modalDesc.innerText = d
    modalPreco.innerText = "R$ " + p
    modalZap.href = `https://wa.me/5500000000000?text=Tenho%20interesse%20no%20produto:%20${encodeURIComponent(t)}`
}

function fecharModal() {
    modal.style.display = "none"
}

/* =======================
   ADMIN
======================= */

const SENHA_ADMIN = "1234"

function loginAdmin() {
    const senha = document.getElementById("senhaAdmin").value
    if (senha === SENHA_ADMIN) {
        localStorage.setItem("adminLogado", "true")
        atualizarAdminBox()
        renderizar()
    } else {
        alert("Senha incorreta")
    }
}

function logoutAdmin() {
    localStorage.removeItem("adminLogado")
    atualizarAdminBox()
    renderizar()
}

function atualizarAdminBox() {
    const adminBox = document.getElementById("adminBox")

    if (localStorage.getItem("adminLogado") === "true") {
        adminBox.innerHTML = `
            <p style="margin-bottom:10px;font-weight:600">
                Administrador logado
            </p>
            <button onclick="logoutAdmin()">Sair</button>
        `
    } else {
        adminBox.innerHTML = `
            <input type="password" id="senhaAdmin" placeholder="Senha administrativa">
            <button onclick="loginAdmin()">Entrar</button>
        `
    }
}

/* =======================
   MENU
======================= */

document.addEventListener("DOMContentLoaded", () => {
    const btnMenu = document.getElementById("btnMenu")
    const menu = document.getElementById("menu")
    const btnAdmin = document.getElementById("btnAdmin")

    btnMenu.onclick = () => {
        menu.style.display = menu.style.display === "block" ? "none" : "block"
    }

    btnAdmin.onclick = (e) => {
        e.preventDefault()
        const adminBox = document.getElementById("adminBox")
        adminBox.style.display =
            adminBox.style.display === "block" ? "none" : "block"
    }

    atualizarAdminBox()
    renderizar()
})
