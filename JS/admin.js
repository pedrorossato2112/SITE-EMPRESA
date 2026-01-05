const btnNovo = document.getElementById("btnNovo")
const modal = document.getElementById("modal")
const cancelar = document.getElementById("cancelar")

btnNovo.onclick = () => {
    modal.style.display = "flex"
}

cancelar.onclick = () => {
    modal.style.display = "none"
}
