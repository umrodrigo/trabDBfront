//Verifica no localStorage qual o id do usuário
const usuarioLogado = localStorage.getItem('userLogado');
// Usado na função botaoSalvar
let indiceUpdate = undefined;
const api = "https://recados-db-back.herokuapp.com";

window.addEventListener('load', () => {        
    axios.get(`${api}/recado/${usuarioLogado}`)
        .then((resposta) => {
            console.log(resposta);
            mostrarRecados(resposta);               
        });
});

// recarregar lista de recados atualizada/editada/apagada
function atualizaRecados() {
    axios.get(`${api}/recado/${usuarioLogado}`)
        .then((resposta) => {
            console.log(resposta);
            mostrarRecados(resposta);               
        });
}

// Constroi lista de recados
function mostrarRecados(resposta) {
    const dados = resposta.data;
    const divTabela = document.getElementById("tabela");
    let conteudo = "<table class>";
    let contador = 1;
    for (const valor of dados) {
        conteudo += `
        <tr>
            <td class="col-1">${contador}</td>
            <td class="col-3" id="des${valor.id}">${valor.descricao}</td>
            <td class="col-6" id="det${valor.id}">${valor.detalhamento}</td>
            <td class="col-2 text-end"><button onclick='botaoEditar("${valor.id}")' type="button" class="btn btn-primary btn-sm"> Editar </button>
                    <button onclick='apagar("${valor.id}")' type="button" class="btn btn-dark btn-sm">Apagar</button></td>                  
        </tr>
        `;
        contador++;
    };
    conteudo += "</table>";
    divTabela.innerHTML = conteudo;
}
//Botão salvar - analisa se cria ou altera
function botaoSalvar() {
    if (indiceUpdate) {
        editarRecados(indiceUpdate);
        indiceUpdate = undefined;
    } else {
        criarRecado();
    }
}
//Botão Editar
function botaoEditar(rid) {
    document.getElementById('inputDescri').value = document.getElementById(`des${rid}`).innerText 
    document.getElementById('inputDetalha').value = document.getElementById(`det${rid}`).innerText;
    indiceUpdate = rid;
}

//Criar um novo Recado
function criarRecado() {
    const descri = document.getElementById('inputDescri').value;
    const detalhes = document.getElementById('inputDetalha').value;
    axios.post(`${api}/recado/${usuarioLogado}`, {
        descricao: descri, detalhamento: detalhes
    }).then((resposta) => {
        chamaAlert('success', 'Recado salvo com sucesso!');
        document.getElementById("inputDescri").value = "";
        document.getElementById("inputDetalha").value = "";
        atualizaRecados();       
    })
}

//Editar recados ok
function editarRecados(rid) {
    const descri = document.getElementById('inputDescri').value;
    const detalhes = document.getElementById('inputDetalha').value;
    axios.put(`${api}/recado/${usuarioLogado}/${rid}`, {
        descricao: descri, detalhamento: detalhes
    }).then((resposta) => {
        chamaAlert('warning', 'Recado editado com sucesso!');
        document.getElementById("inputDescri").value = "";
        document.getElementById("inputDetalha").value = "";
        atualizaRecados()
})}

// Apagar recado ok
function apagar(rid) {    
    axios.delete(`${api}/recado/${usuarioLogado}/${rid}`).then((resposta) => {
        chamaAlert('danger','Atenção! Recado apagado!');
        atualizaRecados();
    })
}

//------- modal -------
function abrirModal(titulo, conteudo, btn, link){
    var myModal = new bootstrap.Modal(document.getElementById('testemodal'), {});
    let a = document.getElementById("tituloModal");
    let b = document.getElementById("conteudoModal");
    let c = document.getElementById("btnModal");    
    a.innerHTML = `<h5 class="modal-title">${titulo}</h5>`
    b.innerHTML = `<p>${conteudo}</p>`
    c.innerHTML = `<button type="button" class="btn btn-secondary" ${link} data-bs-dismiss="modal">${btn}</button>`
    myModal.show();
}
function sair(){
    window.location.href = 'index.html';
}
// ------- Alert -------
function chamaAlert(cor, msg){
    const alerta = document.getElementById('alertMasterUltra');    
    alerta.innerHTML = `<div class="alert alert-${cor}" role="alert">${msg}</div>`
    document.getElementById('alertMasterUltra').style.display = 'block';
    setTimeout(function(){
        document.getElementById('alertMasterUltra').style.display = 'none';
    },3000);
}