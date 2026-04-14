    const checkAcompanhante = document.getElementById('check-acompanhante');
    const areaQuantidade = document.getElementById('area-quantidade');
    const inputQTD = document.getElementById('qtd-pessoas');
    const btnConfirmar = document.getElementById('btn-confirmar');
    checkAcompanhante.addEventListener('change', function() {
        if (this.checked) {
            areaQuantidade.style.display = 'block';
        } else {
            areaQuantidade.style.display = 'none';
        }
    });
    btnConfirmar.addEventListener('click', function() {
        if(checkAcompanhante.checked){
            total = 1 + Number(inputQTD.value)
        }   
        console.log('o total de pessoas é: '+total)
        alert("presença confirmada para: "+total+"pessoas(s)!   ")
    });