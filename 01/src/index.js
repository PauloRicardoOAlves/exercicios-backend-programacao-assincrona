const express = require('express')
const app = express()
const produtos = require('./bancodedados/produtos')
const { getStateFromZipcode, getCityFromZipcode } = require('utils-playground')

//controladores
function listarProdutos(req, res) {
    res.send(produtos)
}

function procurarProduto(req, res) {
    const { id } = req.params

    const produtoEcontrado = produtos.filter((produto) => {
        return produto.id === Number(id)
    })

    res.send(produtoEcontrado)

    return produtoEcontrado
}

async function calcularFrete(req, res) {
    const { id, cep } = req.params
    let precoDoFrete = 0

    const produtoEcontrado = produtos.filter((produto) => {
        return produto.id === Number(id)
    })
    
    const estado = await getStateFromZipcode(cep.toString())

    if (estado === "BA" || estado === "SE" || estado === "AL" || estado === "PE" || estado === "PB") {
        precoDoFrete = produtoEcontrado[0].valor * 0.10
    } else if (estado === "SP" || estado === "RJ") {
        precoDoFrete = produtoEcontrado[0].valor * 0.15
    } else {
        precoDoFrete = produtoEcontrado[0].valor * 0.12
    }

    res.json({
        "produto": produtoEcontrado,
        "cep": estado,
        "frete": precoDoFrete
    })

}
//rotas
app.get('/produtos', listarProdutos)
app.get('/produtos/:id', procurarProduto)
app.get('/produtos/:id/frete/:cep', calcularFrete)


//servidor
app.listen(3000)