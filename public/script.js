const checkAcompanhante = document.getElementById('check-acompanhante');
const areaQuantidade = document.getElementById('area-quantidade');
const inputQTD = document.getElementById('qtd-pessoas');
const btnConfirmar = document.getElementById('btn-confirmar');
const InputN = document.getElementById("input-nome");
checkAcompanhante.addEventListener('change', function() {
    if (this.checked) {
        areaQuantidade.style.display = 'block';
    } else {
        areaQuantidade.style.display = 'none';
    }
});


btnConfirmar.addEventListener('click', function() {
    let total = 1;
    
    if(checkAcompanhante.checked){
        total = 1 + Number(inputQTD.value);
    }
    
  
    const DadosEnviar = {
        nome: InputN.value,
        total: total
    };
    
    const config = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(DadosEnviar) 
    };

    fetch('/confirmar', config)
    .then(response => response.text()) 
    .then(mensagem => {
        console.log('Sucesso:', mensagem);
        alert("Presença confirmada para: " + total + " pessoas(s)!");
    })
    .catch(erro => {
        console.error('Erro ao conectar com o servidor:', erro);
        alert("Erro ao conectar com o servidor.");
    });
});