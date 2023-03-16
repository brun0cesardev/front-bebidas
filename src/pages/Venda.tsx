/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from 'react';
import { ContentHeader } from '@components';
import { Nav } from 'react-bootstrap';
import { SelectCallback } from 'react-bootstrap/esm/helpers';

const Venda = () => {
  const inputDescricaoItem = useRef<HTMLInputElement>(null);
  const inputPrecoUnitarioItem = useRef<HTMLInputElement>(null);
  const inputPrecoCaixaItem = useRef<HTMLInputElement>(null);
  const inputBarraProduto = useRef<HTMLInputElement>(null);
  const qtdeUnitariaDoItem = useRef<HTMLInputElement>(null);
  const qtdeCaixaDoItem = useRef<HTMLInputElement>(null);
  const descontoValorDoItem = useRef<HTMLInputElement>(null);
  const descontoPorcentagemDoItem = useRef<HTMLInputElement>(null);
  const acrescimoValorDoItem = useRef<HTMLInputElement>(null);
  const acrescimoPorcentagemDoItem = useRef<HTMLInputElement>(null);
  const [totalValorLiqTudo, setTotalValorLiq] = useState(0);
  const [totalDescontoTudo, setTotalValorDesc] = useState(0);
  const [totalAcrescimo, setTotalAcrescimo] = useState(0);
  const [totalQtdeUnitTudo, setTotalQtdeUnit] = useState(0);
  const [totalQtdeCaixasTudo, setTotalQtdeCaixas] = useState(0);
  const [totalValorBrutoTudo, setTotalValorBruto] = useState(0);
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTabSelect = (selectedTab: any) => {
    if (selectedTab) {
      setActiveTab(selectedTab);
    };
  };

  function addInfoDataTable(data: any[]) {

    const myTableItensVenda = document.getElementById('tabelaItensVenda') as HTMLTableElement;
    const myTableItensVendaBody = document.getElementById('tabelaTBody') as HTMLTableSectionElement;

    const sData = myTableItensVendaBody.insertRow();
    data.forEach((itemVenda) => {
      const itemNovo = sData.insertCell();
      itemNovo.innerHTML = itemVenda;
    });
    myTableItensVenda.appendChild(myTableItensVendaBody)
  };

  async function atualizaTotais(totalAcresc: number, totalDesconto: number, totalValorBruto: number, totalValorLiq: number, totalQtdeUnit: number, totalQtdeCaixas: number) {
    const totListaItensAcresc = (totalAcresc + totalAcrescimo);
    const totListaItensDesc = (totalDesconto + totalDescontoTudo);
    const totValorBruto = (totalValorBruto + totalValorBrutoTudo);
    const totValorLiq = (totalValorLiq + totalValorLiqTudo);
    const totQtdeUnit = (totalQtdeUnit + totalQtdeUnitTudo);
    const totQtdeCaixas = (totalQtdeCaixas + totalQtdeCaixasTudo);
    setTotalQtdeUnit(+totQtdeUnit);
    setTotalQtdeCaixas(+totQtdeCaixas);
    setTotalValorBruto(+totValorBruto);
    setTotalAcrescimo(+totListaItensAcresc);
    setTotalValorDesc(+totListaItensDesc);
    setTotalValorLiq(+totValorLiq);
  };

  const adicionaItem = async () => {
    const descricaoDoItem = inputDescricaoItem.current?.value;
    const precoUnitarioDoItem = inputPrecoUnitarioItem.current?.value == '' ? 0 : parseFloat(inputPrecoUnitarioItem.current?.value ?? '0');
    const qtdeUnitariaItem = qtdeUnitariaDoItem.current?.value == '' ? 0 : parseFloat(qtdeUnitariaDoItem.current?.value ?? '0');
    const qtdeCaixaItem = qtdeCaixaDoItem.current?.value == '' ? 0 : parseFloat(qtdeCaixaDoItem.current?.value ?? '0');

    if (qtdeUnitariaItem == 0 && qtdeCaixaItem == 0) {
      alert('Produto não existe quantidade informada! Verifique.');
      return;
    };

    const precoCaixaDoItem = inputPrecoCaixaItem.current?.value == '' ? 0 : parseFloat(inputPrecoCaixaItem.current?.value ?? '0');
    const descontoPorcentagemItem = descontoPorcentagemDoItem.current?.value == '' ? 0 : parseFloat(descontoPorcentagemDoItem.current?.value ?? '0');
    const descontoValorItem = descontoValorDoItem.current?.value == '' ? 0 : parseFloat(descontoValorDoItem.current?.value ?? '0');
    const acrescValorItem = acrescimoValorDoItem.current?.value == '' ? 0 : parseFloat(acrescimoValorDoItem.current?.value ?? '0');
    const acrescPercItem = acrescimoPorcentagemDoItem.current?.value == '' ? 0 : parseFloat(acrescimoPorcentagemDoItem.current?.value ?? '0');
    const valorTotDoItem = await calculaValorTotal(qtdeUnitariaItem, precoUnitarioDoItem, qtdeCaixaItem, precoCaixaDoItem, descontoPorcentagemItem, descontoValorItem, acrescValorItem, acrescPercItem);
    const maisItem = [descricaoDoItem, qtdeUnitariaItem, qtdeCaixaItem, precoUnitarioDoItem.toFixed(2).replace('.', ','), precoCaixaDoItem.toFixed(2).replace('.', ','), valorTotDoItem.toFixed(2).replace('.', ',')];
    addInfoDataTable(maisItem)
  };

  async function calculaValorTotal(qtdeUnitaria: number,
    precoUnitarioItem: number,
    qtdeCaixas: number,
    precoCaixaItem: number,
    descontoPorcentagemItem: number,
    descontoValorItem: number,
    acrescimoValorItem: number,
    acrescimoPorcenItem: number) {
    const totSemDescontoUnitario = (qtdeUnitaria * precoUnitarioItem);
    const totSemDescontoCaixa = (qtdeCaixas * precoCaixaItem);
    const totSemDesconto = (totSemDescontoCaixa + totSemDescontoUnitario);
    const totValorDescPorcentagemItem = (totSemDesconto * (descontoPorcentagemItem / 100));
    const totValorAcrescPorcentagemItem = (totSemDesconto * (acrescimoPorcenItem / 100));
    const totAcrescimo = (acrescimoValorItem + totValorAcrescPorcentagemItem);
    const totDesconto = (descontoValorItem + totValorDescPorcentagemItem);
    const totValorComDesconto = ((totSemDesconto + totAcrescimo) - totDesconto);
    await atualizaTotais(totAcrescimo, totDesconto, totSemDesconto, totValorComDesconto, qtdeUnitaria, qtdeCaixas);
    return totValorComDesconto;
  };

  return (
    <div>
      <ContentHeader title="Venda" />
      <section className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title pt-2"><strong>Venda: 1</strong></h3>
              <div className='card-tools'>
                <input className='form-control' type='date' value='2023-03-02' disabled={true} />
              </div>
            </div>
            <div className="card-body">
              {activeTab === 'tab1' && (
                <div>
                  <div className="form-group row col-sm-12">
                    <div className="row col-sm-12">
                      <label htmlFor='inputCodigoProd' className='col-sm-3'>
                        Barra:
                      </label>
                      <label htmlFor='inputCodigoProd' className='col-sm-9'>
                        Produto:
                      </label>
                      <div className='col-sm-3'>
                        <input
                          className='form-control'
                          value="987654321"
                          ref={inputBarraProduto}
                          id="txtBarraProduto"
                          type="text" />
                      </div>
                      <div className='col-sm-9'>
                        <input className='form-control' ref={inputDescricaoItem} id="txtDescricaoProduto" type="text" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group row col-sm-12">
                    <div className="row col-sm-12">
                      <label htmlFor='txtQtdeUnitaria' className='col-sm-3'>
                        Qtde Unitária:
                      </label>
                      <label htmlFor='txtQtdeCaixas' className='col-sm-3'>
                        Qtde em Caixas:
                      </label>
                      <label htmlFor='txtPrecoUnitario' className='col-sm-3'>
                        Preço Unitário:
                      </label>
                      <label htmlFor='txtPrecoCaixas' className='col-sm-3'>
                        Preço Caixa:
                      </label>
                      <div className='col-sm-3'>
                        <input className='form-control' ref={qtdeUnitariaDoItem} id="txtQtdeUnitaria" type="number" />
                      </div>
                      <div className='col-sm-3'>
                        <input className='form-control' ref={qtdeCaixaDoItem} id="txtQtdeCaixas" type="number" />
                      </div>
                      <div className='col-sm-3'>
                        <input className='form-control' disabled={true} ref={inputPrecoUnitarioItem} value="10" id="txtPrecoUnitario" type="number" />
                      </div>
                      <div className='col-sm-3'>
                        <input className='form-control' disabled={true} ref={inputPrecoCaixaItem} value="60" id="txtPrecoCaixas" type="number" />
                      </div>
                    </div>
                  </div>
                  <div className='form-group row col-sm-12'>
                    <div className='row col-sm-12'>
                      <label htmlFor='txtDescontoValor' className='col-sm-3'>
                        Desconto(R$):
                      </label>
                      <label htmlFor='txtDescontoPorcentagem' className='col-sm-3'>
                        Desconto(%):
                      </label>
                      <label htmlFor='txtAcrescimoValor' className='col-sm-3'>
                        Acréscimo(R$):
                      </label>
                      <label htmlFor='txtAcrescimoPorcentagem' className='col-sm-3'>
                        Acréscimo(%):
                      </label>
                      <div className='col-sm-3'>
                        <input className='form-control mt-1' ref={descontoValorDoItem} id="txtDescontoValor" type="number" />
                      </div>
                      <div className='col-sm-3'>
                        <input className='form-control mt-1' ref={descontoPorcentagemDoItem} id="txtDescontoPorcentagem" type="number" />
                      </div>
                      <div className='col-sm-3'>
                        <input className='form-control mt-1' ref={acrescimoValorDoItem} id="txtAcrescimoValor" type="number" />
                      </div>
                      <div className='col-sm-3'>
                        <input className='form-control mt-1' ref={acrescimoPorcentagemDoItem} id="txtAcrescimoPorcentagem" type="number" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group row col-sm-12">
                    <div className="row col-sm-12">
                      <div className='col-sm-6'>
                        <button
                          className="btn btn-info btn-lg pb-1 mr-2"
                          onClick={async () => { adicionaItem() }}
                          id="btnAdicionaItem">
                          Adicionar Item
                        </button>
                        <button className="btn btn-danger btn-lg pb-1" id="btnExcluiItem">Excluir Item</button>
                      </div>
                    </div>
                  </div>
                  <table id="tabelaItensVenda" className="table table-lg-responsive table-bordered" style={{ whiteSpace: 'nowrap', backgroundColor: '#343a44' }}>
                    <thead>
                      <th>Produto</th>
                      <th>Qtde Unit.</th>
                      <th>Qtde Caixas</th>
                      <th>Preço Unit.</th>
                      <th>Preço Caixas</th>
                      <th>Valor Total</th>
                    </thead>
                    <tbody id="tabelaTBody">
                      <tr>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === "tab2" && (
                <div>
                  <div className="form-group row col-sm-12">
                    <div className="row col-sm-12">
                      <label htmlFor='txtQtdeUnitaria' className='col-sm-3'>
                        Qtde Unitária:
                      </label>
                      <label htmlFor='txtQtdeCaixas' className='col-sm-3'>
                        Qtde em Caixas:
                      </label>
                      <label htmlFor='txtPrecoUnitario' className='col-sm-3'>
                        Preço Unitário:
                      </label>
                      <label htmlFor='txtPrecoCaixas' className='col-sm-3'>
                        Preço Caixa:
                      </label>
                      <div className='col-sm-3'>
                        <input className='form-control' ref={qtdeUnitariaDoItem} id="txtQtdeUnitaria" type="number" />
                      </div>
                      <div className='col-sm-3'>
                        <input className='form-control' ref={qtdeCaixaDoItem} id="txtQtdeCaixas" type="number" />
                      </div>
                      <div className='col-sm-3'>
                        <input className='form-control' disabled={true} ref={inputPrecoUnitarioItem} value="10" id="txtPrecoUnitario" type="number" />
                      </div>
                      <div className='col-sm-3'>
                        <input className='form-control' disabled={true} ref={inputPrecoCaixaItem} value="60" id="txtPrecoCaixas" type="number" />
                      </div>
                    </div>
                  </div>
                  <div className='form-group row col-sm-12'>
                    <div className='row col-sm-12'>
                      <label htmlFor='txtDescontoValor' className='col-sm-3'>
                        Desconto(R$):
                      </label>
                      <label htmlFor='txtDescontoPorcentagem' className='col-sm-3'>
                        Desconto(%):
                      </label>
                      <label htmlFor='txtAcrescimoValor' className='col-sm-3'>
                        Acréscimo(R$):
                      </label>
                      <label htmlFor='txtAcrescimoPorcentagem' className='col-sm-3'>
                        Acréscimo(%):
                      </label>
                      <div className='col-sm-3'>
                        <input className='form-control mt-1' ref={descontoValorDoItem} id="txtDescontoValor" type="number" />
                      </div>
                      <div className='col-sm-3'>
                        <input className='form-control mt-1' ref={descontoPorcentagemDoItem} id="txtDescontoPorcentagem" type="number" />
                      </div>
                      <div className='col-sm-3'>
                        <input className='form-control mt-1' ref={acrescimoValorDoItem} id="txtAcrescimoValor" type="number" />
                      </div>
                      <div className='col-sm-3'>
                        <input className='form-control mt-1' ref={acrescimoPorcentagemDoItem} id="txtAcrescimoPorcentagem" type="number" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group row col-sm-12">
                    <div className="row col-sm-12">
                      <div className='col-sm-6'>
                        <button
                          className="btn btn-info btn-lg pb-1 mr-2"
                          onClick={async () => { adicionaItem() }}
                          id="btnAdicionaItem">
                          Adicionar Item
                        </button>
                        <button className="btn btn-danger btn-lg pb-1" id="btnExcluiItem">Excluir Item</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="card-footer">
              <Nav variant="tabs" activeKey={activeTab} onSelect={handleTabSelect}>
                <Nav.Item>
                  <Nav.Link eventKey="tab1" style={{ color: "white" }} href="#">
                    Itens da Venda
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="tab2" style={{ color: "white" }} href="#">
                    Totais da Venda
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
          </div>
        </div>
      </section >
    </div>
  )
};

export default Venda;
