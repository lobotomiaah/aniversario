const checkAcompanhante = document.getElementById('check-acompanhante');
const areaQuantidade = document.getElementById('area-quantidade');
const inputQTD = document.getElementById('qtd-pessoas');
const btnConfirmar = document.getElementById('btn-confirmar');
const InputN = document.getElementById("input-nome");

checkAcompanhante.addEventListener('change', function() {
    areaQuantidade.style.display = this.checked ? 'block' : 'none';
});

btnConfirmar.addEventListener('click', function(event) {
    event.preventDefault(); 

    let total = 1;
    let nome = InputN.value.trim();

    if (!nome) {
        alert("Por favor, digite seu nome.");
        return;
    }

    if (checkAcompanhante.checked) {
        const acompanhantes = Number(inputQTD.value) || 0;
        total = 1 + acompanhantes;
    }
    
    const DadosEnviar = {
        nome: nome,
        total: total
    };
    
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(DadosEnviar) 
    };

    fetch('/confirmar', config)
    .then(response => {
        if (!response.ok) throw new Error();
        return response.text();
    }) 
    .then(() => {
        alert("Presença confirmada com sucesso!");
        InputN.value = "";
        inputQTD.value = "";
        checkAcompanhante.checked = false;
        areaQuantidade.style.display = 'none';
    })
    .catch(() => {
        alert("Erro ao enviar confirmação.");
    });
});