
const btnConfirmar = document.getElementById('btn-confirmar');
const InputN = document.getElementById("input-nome");
btnConfirmar.addEventListener('click', function(event) {
    event.preventDefault(); 

    let total = 1;
    let nome = InputN.value.trim();

    if (!nome) {
        alert("Por favor, digite seu nome.");
        return;
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
    })
    .catch(() => {
        alert("Erro ao enviar confirmação.");
    });
});