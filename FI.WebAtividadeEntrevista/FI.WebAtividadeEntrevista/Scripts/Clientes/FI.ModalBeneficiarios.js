var ModalBeneficiarios = (function () {
    let beneficiarios = [];
    let beneficiariosRemovidos = [];
    let cpfEditando = null;

    function init() {
        $('#CpfBenef').mask('000.000.000-00');
        const btnAdicionar = document.getElementById('btnAdicionarBenef');
        const tabela = document.querySelector('#gridBeneficiarios tbody');

        btnAdicionar.addEventListener('click', function () {
            const nome = document.getElementById('NomeBenef').value.trim();
            const cpf = document.getElementById('CpfBenef').value.trim();

            if (!nome || !cpf) {
                ModalDialog("Erro:", 'Preencha o nome e o CPF do beneficiario.');
                return;
            }

            if (!isCpfValido(cpf)) {
                ModalDialog("Erro:", 'O CPF informado e inválido.');
                return;
            }

            if (cpfEditando) {
            

                if (cpf !== cpfEditando && beneficiarios.some(b => b.Cpf === cpf)) {
                    ModalDialog("Erro:", 'Ja existe um beneficiario com esse CPF.');
                    return;
                }

       
                const index = beneficiarios.findIndex(b => b.Cpf === cpfEditando);
                if (index !== -1) {
                    beneficiarios[index] = { Nome: nome, Cpf: cpf };
                }

     
                const linhas = tabela.querySelectorAll('tr');
                linhas.forEach(linha => {
                    if (linha.children[0].textContent === cpfEditando) {
                        linha.children[0].textContent = cpf;
                        linha.children[1].textContent = nome;
                    }
                });

                cpfEditando = null; 

            } else {
                
                if (beneficiarios.some(b => b.Cpf === cpf)) {
                    ModalDialog("Erro:", 'Ja existe um beneficiario com esse CPF.');
                    return;
                }

                beneficiarios.push({ Nome: nome, Cpf: cpf });

                const novaLinha = document.createElement('tr');
                novaLinha.innerHTML = `
                    <td>${cpf}</td>
                    <td>${nome}</td>
                    <td>
                        <button type="button" class="btn btn-sm btn-info btn-alterar">Alterar</button>
                        <button type="button" class="btn btn-sm btn-info btn-remover">Remover</button>
                    </td>
                 `;
                tabela.appendChild(novaLinha);
            }

          
            document.getElementById('NomeBenef').value = '';
            document.getElementById('CpfBenef').value = '';
        });


        tabela.addEventListener('click', function (e) {
            if (e.target.classList.contains('btn-remover')) {
                const row = e.target.closest('tr');
                const cpf = row.children[0].textContent;

                beneficiariosRemovidos.push(cpf);

                beneficiarios = beneficiarios.filter(b => b.Cpf !== cpf);
                row.remove();
            }

            if (e.target.classList.contains('btn-alterar')) {
                const row = e.target.closest('tr');
                const cpf = row.children[0].textContent;
                const nome = row.children[1].textContent;

                document.getElementById('CpfBenef').value = cpf;
                document.getElementById('NomeBenef').value = nome;

                cpfEditando = cpf;
            }

        });
    }

    function getBeneficiariosRemovidos() {
        return beneficiariosRemovidos;
    }
    function getBeneficiarios() {
        return beneficiarios;
    }

    return {
        iniciar: init,
        getBeneficiarios: getBeneficiarios,
        getBeneficiariosRemovidos: getBeneficiariosRemovidos
    };
})();


function removerBeneficiario(cpf, callbackSucesso) {
    $.ajax({
        url: '/Beneficiario/RemoverPorCpf', // ajuste conforme seu controller
        type: 'POST',
        data: { cpf: cpf },
        success: function (res) {
            if (res.sucesso) {
                callbackSucesso();
            } else {
                ModalDialog("Erro:", "Erro ao remover beneficiário.");
            }
        },
        error: function () {
            ModalDialog("Erro", "Erro ao se comunicar com o servidor.");
        }
    });
}

function editarBeneficiarioNoBanco(cpf, nome, callbackSucesso) {
    $.ajax({
        url: '/Beneficiario/Alterar',
        type: 'POST',
        data: { Cpf: cpf, Nome: nome },
        success: function (res) {
            if (res.sucesso) {
                callbackSucesso();
            } else {
                ModalDialog("Erro:", "Erro ao editar beneficiário.");
            }
        },
        error: function () {
            ModalDialog("Erro", "Erro ao se comunicar com o servidor.");
        }
    });
}


