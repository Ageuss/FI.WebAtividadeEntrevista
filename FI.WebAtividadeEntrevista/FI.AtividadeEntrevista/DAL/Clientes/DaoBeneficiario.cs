using FI.AtividadeEntrevista.BLL;
using FI.AtividadeEntrevista.DML;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace FI.AtividadeEntrevista.DAL
{
    internal class DaoBeneficiario : AcessoDados
    {
        internal long Incluir(Beneficiario beneficiario)
        {
            var parametros = new List<System.Data.SqlClient.SqlParameter>
            {
                new System.Data.SqlClient.SqlParameter("Nome", beneficiario.Nome),
                new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPF),
                new System.Data.SqlClient.SqlParameter("IdCliente", beneficiario.ClienteId) 
            };

            DataSet ds = base.Consultar("FI_SP_IncBeneficiario", parametros);
            long ret = 0;
            if (ds.Tables[0].Rows.Count > 0)
                long.TryParse(ds.Tables[0].Rows[0][0].ToString(), out ret);
            return ret;
        }

        internal List<DML.Beneficiario> Listar()
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("Id", 0));

            DataSet ds = base.Consultar("FI_SP_ConsBeneficiario", parametros);
            List<DML.Beneficiario> benef = Converter(ds);

            return benef;
        }

        internal Beneficiario Consultar(long idCliente, string cpf)
        {
            var parametros = new List<System.Data.SqlClient.SqlParameter>
            {
                new System.Data.SqlClient.SqlParameter("IdCliente", idCliente),
                new System.Data.SqlClient.SqlParameter("CPF", cpf) 
            };

            DataSet ds = base.Consultar("FI_SP_ConsBeneficiarioPorCliente", parametros);
            List<Beneficiario> lista = Converter(ds);

            return lista.FirstOrDefault();
        }

        internal void Alterar(Beneficiario beneficiario)
        {
            var parametros = new List<System.Data.SqlClient.SqlParameter>
            {
                new System.Data.SqlClient.SqlParameter("Id", beneficiario.Id),
                new System.Data.SqlClient.SqlParameter("Nome", beneficiario.Nome),
                new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPF),
                new System.Data.SqlClient.SqlParameter("IdCliente", beneficiario.ClienteId)
            };

            base.Executar("FI_SP_AltBeneficiario", parametros);
        }

        internal void Excluir(long idCliente, string cpf)
        {
            var parametros = new List<System.Data.SqlClient.SqlParameter>
            {
                new System.Data.SqlClient.SqlParameter("IdCliente", idCliente),
                new System.Data.SqlClient.SqlParameter("Cpf", cpf)
            };

            base.Executar("FI_SP_DelBeneficiario", parametros);
        }

        internal bool VerificarExistencia(string CPF)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("CPF", CPF));

            DataSet ds = base.Consultar("FI_SP_VerificaBeneficiario", parametros);

            return ds.Tables[0].Rows.Count > 0;
        }

        private List<Beneficiario> Converter(DataSet ds)
        {
            var lista = new List<Beneficiario>();

            if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    Beneficiario ben = new Beneficiario
                    {
                        Id = row.Field<long>("Id"),
                        Nome = row.Field<string>("Nome"),
                        CPF = row.Field<string>("CPF"),
                        ClienteId =  row.Field<long>("IdCliente") 
                    };
                    lista.Add(ben);
                }
            }

            return lista;
        }
    }
}
