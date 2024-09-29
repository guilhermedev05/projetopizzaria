let pizzaId
let modalQtd = 1
let cart = []

/* 
    A função select funciona como o query selector mas ela tem o nome reduzido, 
    o que facilita na leitura do código.
    A função selectAll seleciona todos os elementos.
*/

const select = (el)=>document.querySelector(el)
const selectAll = (el)=>document.querySelectorAll(el)


/*
    Mapeamos a váriavel pizzaJson que contém um array com todas as pizzas.
*/
pizzaJson.map((item, index) => {
    /*
        Clonamos o modelo HTML das pizzas para posteriormente inserir as informações e
        adicionar dinamicamente no HTML
    */
    let pizzaItem = select('.models .pizza-item').cloneNode(true)
    
    /* 
        Vamos setar o atributo data-key nas divs pizza-item, para que possamos ter um controle 
        de qual pizza estamos selecionando
    */
    pizzaItem.setAttribute('data-key', index)
    /*
        Selecionamos as informações no HTML e alteramos dinamicamente para as informações
        que temos no parâmetro item da mapeação do array pizzaJSON
    */
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
    pizzaItem.querySelector('a').addEventListener('click', e => {
        /*
            Primeiro definimos a ação do Link como padrão, para que ele não atualize a área
        */
        e.preventDefault()
        /*
            Aqui nós pegamos o atributo data-key atráves do target ( que é o item que clicamos)
            e armazenamos o valor numa variável.
            Atráves do método closest(), ele vai procurar próximo a div que selecionamos o valor
            que colocamos como parâmetro da função.
        */
        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        // Sempre que o modal for aberto o ModalQTD ( QTD de pizzas ) vai ser setado em 1.
        modalQtd = 1
        pizzaId = key

        select('.pizzaBig img').src = pizzaJson[key].img
        select('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        select('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
        select('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
        select('.pizzaInfo--size.selected').classList.remove('selected')
        selectAll('.pizzaInfo--size').forEach((size, sizeIndex)=> {
            if(sizeIndex == 2){
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]

        })
        select('.pizzaInfo--qt').innerHTML = modalQtd

        /*
            Aqui fazemos um efeito para que quando clique na área do link ele abra o modal, com
            um efeito, para que não fique algo feio
        */
        select('.pizzaWindowArea').style.opacity = 0
        select('.pizzaWindowArea').style.display = 'flex'
        /*
            Aqui fizemos um setTimeOut para que ele espera 200ms antes de mudar a opacidade para 1,
            fazendo um efeito de fade muito legal
        */
        setTimeout(()=>{
            select('.pizzaWindowArea').style.opacity = 1
        }, 200)
    })
    /*
        Feito isso, usamos o append para adicionar as pizzas no HTML
    */
    select('.pizza-area').append(pizzaItem)
})

// Esta função é responsável por fechar o modal das pizzas

function closeModal() {
    select('.pizzaWindowArea').style.opacity = 0
    setTimeout(()=>{
        select('.pizzaWindowArea').style.display = 'none'
    }, 500)
}

selectAll('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item) => {
    item.addEventListener('click', closeModal)
})

// Este código adiciona decrementação de quantidade de pizzas
select('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(modalQtd > 1){
        modalQtd --
        let actualPrice = pizzaJson[pizzaId].price * modalQtd
        select('.pizzaInfo--qt').innerHTML = modalQtd
        select('.pizzaInfo--actualPrice').innerHTML = `R$ ${actualPrice.toFixed(2)}`
    }
})

// Este código adiciona incrementação de quantidade de pizzas
select('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQtd ++
    let actualPrice = pizzaJson[pizzaId].price * modalQtd
    select('.pizzaInfo--qt').innerHTML = modalQtd
    select('.pizzaInfo--actualPrice').innerHTML = `R$ ${actualPrice.toFixed(2)}`
})

/* 
    Este código vai adicionar o estilo da classe selected quando os botões
    de tamanho forem clicados.
*/
selectAll('.pizzaInfo--size').forEach((size)=> {
    size.addEventListener('click', (e) => {
        select('.pizzaInfo--size.selected').classList.remove('selected')
        /*
            Utilizamos o size ao invés do e.target pois ele sempre seleciona toda a div
            quando é clicado,se utilizarmos o e.target, ele vai adicionar exatamente
            o que foi clicado, então se clicassemos no span do peso, ele ia adicionar
            a classe selected no peso ao invés de adicionar na div.
        */ 
        size.classList.add('selected')
    })
})


select('.pizzaInfo--addButton').addEventListener('click', () => {
    // Criamos a variável size para armazenar o tamanho da pizza
    let size = parseInt(select('.pizzaInfo--size.selected').getAttribute('data-key'))

    /* 
	    Esta variável armazena o id e o tamanho da pizza numa string, 
        que serve como identificador.
    */
    let identifier = pizzaJson[pizzaId].id+'#'+ size
    /* 
        Esta variável armazena o index se o objeto identifier for igual à variável identifier,
        Se não ele retorna -1 (que significa que não encontrou),
    */
    let key = cart.findIndex(item => item.identifier == identifier)

    /*
        Criamos uma verificação para saber se encontrou ou não o identifier, se sim, ele aumenta
        a quantidade de pizzas de acordo com a pizza escolhida, se não, ele adiciona a pizza ao carrinho.
    */
   
    if(key > -1){
        cart[key].qtd += modalQtd
    }else{
        // Feito isso, fazemos o envio das informações através de um objeto com as informações da pizza
        cart.push({
            identifier,
            id: pizzaJson[pizzaId].id,
            size,
            qtd: modalQtd,
        })
    }
    
    updateCart()
    closeModal()
})

/*
    Aqui, quando o usuário clica no carrinho, ele abre o menu com as pizzas, mudando o left para 0
    pois o left 100vw faz com que o menu fique escondido, quando muda para 0 ele aparece.
*/
select('.menu-openner').addEventListener('click', () => {
    select('aside').style.left = '0'
})

// Aqui fechamos o menu mobile ao clicar no X

select('.menu-closer').addEventListener('click', () => {
    select('aside').style.left = '100vw'
})

function updateCart(){
    // Assim que atualizamos o carrinho, ele atualiza a qtd de pizzas no menu mob
    select('.menu-openner span').innerHTML = cart.length

    if(cart.length > 0){
        select('aside').classList.add('show')
        select('.cart').innerHTML = ''

        let subtotal = 0
        let desconto = 0
        let total = 0
        for(let i in cart){
            /*
                Aqui fazemos um loop para adicionar os itens do carrinho na variável
                pizza item.
            */
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id)
            /*
                Aqui clonamos a div modelo ( 'cart--item' ), que com ela poderemos
                selecionar as divs filho.
            */
           subtotal += pizzaItem.price * cart[i].qtd
            let cartItem = select('.models .cart--item').cloneNode(true)
            /*
                Aqui criamos uma variável que vai armanezar o tamanho de acordo com o escolhido
                pelo usuário.
            */
            let pizzaSizeName
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P'
                    break
                case 1:
                    pizzaSizeName = 'M'
                    break
                case 2:
                    pizzaSizeName = 'G'
                    break
            }
            /*
                Aqui construimos uma variável que vai juntar o nome da pizza o
                seu tamanho em parênteses
            */
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            /*
                Aqui preenchemos as informações das pizzas
            */
            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd
            /*
                Aqui adicionamos funcionalidade aos botões de aumentar e diminuir
                a qtd de pizzas.
            */
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qtd > 1){
                    cart[i].qtd--
                }else{
                    cart.splice(i,1)
                }
                updateCart()
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qtd++
                updateCart()
            })
            select('.cart').append(cartItem)
        }

        desconto = subtotal * 0.1
        total = subtotal - desconto
        console.log(desconto)
        console.log(subtotal)
        console.log(total)
        select('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        select('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        select('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`
    }else{
        select('aside').classList.remove('show')
        select('aside').style.left = '100vw'
    }
}