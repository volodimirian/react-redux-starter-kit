import React, {
  Component
} from 'react';
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import Axios from 'axios'

import { saveOrders } from '../../../store/orders'
import 'react-table/react-table.css'
import './OrdersTable.scss';

class OrdersTable extends React.Component {
  state = {
    loading: false,
    page: 1,
    pageSize: 15,
    pages: 1,
    data: []
  }

  columns = [{
    id: 'id',
    sortable: false,
    accessor: props => <span className={"two-string-column " + this.getStateClass(props.delivery_state)}>
        <div>
          <strong>Order ID: </strong> {props.id}
        </div>
        <div>
          <strong>Date: </strong> {new Date(props.date).toISOString().slice(0, 10)}
        </div>
      </span>

  }, {
    Header: 'Tracking number',
    id: 'tracking_number',
    sortable: false,
    accessor: props => <strong className={this.getStateClass(props.delivery_state)}>{props.tracking_number}</strong>
  }, {
    Header: 'Delivery state',
    id: 'delivery_state',
    sortable: false,
    accessor: props => <span className={"state " + this.getStateClass(props.delivery_state)}><p>{props.delivery_state.split('_').join(' ')}</p></span>
  }, {
    Header: 'Delivery description',
    id: 'delivery_status',
    sortable: false,
    accessor: props => <span className={"could-be-red " + this.getStateClass(props.delivery_state)}>
      {props.delivery_status}
    </span>
  }, {
    Header: 'Delivery date',
    id: 'delivery_date',
    sortable: false,
    accessor: props => <span className={"could-be-red " + this.getStateClass(props.delivery_state)}>{new Date(props.delivery_date).toISOString().slice(0, 10)}</span>
  }, {
    Header: 'Delivery dely',
    id: 'delivery_dely',
    sortable: false,
    accessor: props => <span className={this.getStateClass(props.delivery_state)}>{new Date(props.delivery_date - props.exact_delivery_date).toISOString().slice(0, 10)}</span>
  }]

  constructor() {
    super();
    this.fetchData = this.fetchData.bind(this);
  }

  getStateClass(state) {
    if (state.indexOf('processing') !== -1) {
      return 'processing';
    } else if (state.indexOf('tracking') !== -1) {
      return 'tracking';
    } else if (state.indexOf('completed') !== -1) {
      return 'completed';
    }
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.orders) !== nextProps.orders) {
      Object.values(nextProps.orders).forEach((elem) => elem.selected && console.log('selected data: ', elem))
      this.setState({
        data: Object.values(nextProps.orders)
      })
    }
  }

  fetchData(state, instance) {
    this.setState({ loading: true });

    Axios.get('api/orders', {
      page: state.page,
      pageSize: state.pageSize
    }).then((res) => {
        let objSaveInStore = {};
        res.data.data.forEach((elem) => {
          objSaveInStore[elem.tracking_number] = elem;
        })
        this.props.saveOrders(objSaveInStore);
        this.setState({
          data: res.data.data,
          pages: res.data.pages,
          loading: false
        })
      }, (res) => {
        this.setState({
          loading: false
        });
        console.error('[Error in Orders Table component] url for fetching is not accessable');
      })
  }

  clickOnRow(row) {
    let objSaveInStore = {};
    this.state.data.forEach(elem => {
      if (elem.tracking_number === row.tracking_number) {
        elem.selected = !elem.selected
      } else {
        elem.selected = false;
      }
      objSaveInStore[elem.tracking_number] = elem;
    });
    this.props.saveOrders(objSaveInStore);
  }

  render() {
    const { data } = this.state;

    Object.values(data).forEach(elem => elem.selected && console.log('selected data in render: ', elem));

    return (
      <ReactTable
        columns = {this.columns}
        manual // Forces table not to paginate or sort automatically, so we can handle it server-side
        data = {data}
        pages = {this.state.pages} // Display the total number of pages
        loading = {this.state.loading} // Display the loading overlay when we need it
        onFetchData = {this.fetchData} // Request new data when things change
        filterable = {false}
        defaultPageSize = {10}
        showPageSizeOptions = {false}
        showPaginationTop = {false}
        showPaginationBottom = {false}
        getTrProps={(state, rowInfo, column) => {
          return rowInfo ? {
            style: {
              background: rowInfo.original.selected ? '#d4d9f7' : '',
            },
            className: 'table-row',
            onClick: this.clickOnRow.bind(this, rowInfo.original)
          } : {};
        }}
        className = "-striped -highlight"
      />)
  }
}

const mapStateToProps = (state, ownProps) => ({
  orders: state.orders
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  saveOrders: (orders) => dispatch(saveOrders(orders))
})

export default connect(mapStateToProps, mapDispatchToProps)(OrdersTable);
// export default OrdersTable
