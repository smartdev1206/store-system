// @flow

import React, { Component, Fragment } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Creators as StockCreators } from '../../store/ducks/stock';
import { Creators as SaleCreators } from '../../store/ducks/sale';

import EntityComponent from '../../components/common/entity-component';
import Snackbar from '../../components/common/Snackbar';

import config from './config';
import Form from './form';

type Props = {
  getAllSales: Function,
  createSale: Function,
  getStock: Function,
  editSale: Function,
  stock: Arra<Object>,
  sale: Arra<Object>,
};

type State = {
  isSnackbarOpen: boolean,
};

class Sales extends Component<Props, State> {
  state = {
    isSnackbarOpen: false,
  };

  componentDidMount() {
    const { getAllSales, getStock } = this.props;

    getAllSales();
    getStock();
  }

  componentWillReceiveProps(nextProps) {
    const { message, error } = nextProps.sale;

    if (message || error) {
      this.setState({
        isSnackbarOpen: true,
      });
    }
  }

  onCreateSale = (sale: Object): void => {
    const { createSale } = this.props;

    createSale(sale);
  };

  onEditSale = (saleEdited: Object): void => {
    const { editSale } = this.props;

    editSale(saleEdited);
  };

  renderSnackbar = (sales: Object): Object => {
    const { isSnackbarOpen } = this.state;
    const { message, error } = sales;

    return (
      <Snackbar
        onCloseSnackbar={() => this.setState({ isSnackbarOpen: false })}
        isOpen={isSnackbarOpen}
        message={message}
        error={error}
      />
    );
  };

  render() {
    const { sale, stock } = this.props;

    return (
      <Fragment>
        <EntityComponent
          filterConfig={config.filterConfig}
          onCreateItem={this.onCreateSale}
          tabConfig={config.tabConfig}
          onEditItem={this.onEditSale}
          singularEntityName="Venda"
          pluralEntityName="Vendas"
          withOwnTitle="NOVA VENDA"
          dataset={sale.data}
          canBeCreated
          canBeEdited
          Form={props => (
            <Form
              {...props}
              stock={stock}
            />
          )}
        />
        {this.renderSnackbar(sale)}
      </Fragment>
    );
  }
}

const Creators = Object.assign({}, SaleCreators, StockCreators);

const mapDispatchToProps = dispatch => bindActionCreators(Creators, dispatch);

const mapStateToProps = state => ({
  stock: state.stock.data,
  sale: state.sale,
});

export default connect(mapStateToProps, mapDispatchToProps)(Sales);