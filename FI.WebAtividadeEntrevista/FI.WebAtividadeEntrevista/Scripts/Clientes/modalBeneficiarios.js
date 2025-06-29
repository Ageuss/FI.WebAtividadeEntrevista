var ModalBeneficiarios = (function () {
    let beneficiarios = [];

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
                ModalDialog("Erro:", 'O CPF informado e invalido.');
                return;
            }

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
                    <button type="button" class="btn btn-sm btn-info btn-remover">Excluir</button>
               </td>

            `;
            tabela.appendChild(novaLinha);

            document.getElementById('NomeBenef').value = '';
            document.getElementById('CpfBenef').value = '';
        });

        tabela.addEventListener('click', function (e) {
            if (e.target.classList.contains('btn-remover')) {
                const row = e.target.closest('tr');
                const cpf = row.children[0].textContent;
                beneficiarios = beneficiarios.filter(b => b.Cpf !== cpf);
                row.remove();
            }
            if (e.target.classList.contains('btn-alterar')) {
                const row = e.target.closest('tr');
                const cpf = row.children[0].textContent;
                const nome = row.children[1].textContent;

                document.getElementById('CpfBenef').value = cpf;
                document.getElementById('NomeBenef').value = nome;

                beneficiarios = beneficiarios.filter(b => b.Cpf !== cpf);
                row.remove();
            }

        });
    }

    function getBeneficiarios() {
        return beneficiarios;
    }

    return {
        iniciar: init,
        getBeneficiarios: getBeneficiarios
    };
})();


