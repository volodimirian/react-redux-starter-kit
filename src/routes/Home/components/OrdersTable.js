import React, {
  Component
} from 'react';
import ReactTable from 'react-table'
import Axios from 'axios'

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
    accessor: props => <span className={"two-string-column " + this.getStateClass(props.delivery_state)}>
        <div>
          <strong>Order ID: </strong> {props.id} 
        </div>
        <div>
          <strong>Date: </strong> {new Date(props.date).toISOString().slice(0, 10)}
        </div> 
      </span>
  }, {
    id: 'tracking_number',
    Header: 'Tracking number',
    accessor: props => <strong className={this.getStateClass(props.delivery_state)}>{props.tracking_number}</strong>
  }, {
    Header: 'Delivery state',
    id: 'delivery_state',
    accessor: props => <span className={"state " + this.getStateClass(props.delivery_state)}><p>{props.delivery_state.split('_').join(' ')}</p></span>
  }, {
    Header: 'Delivery description',
    id: 'delivery_status',
    accessor: props => <span className={"could-be-red " + this.getStateClass(props.delivery_state)}>
      {props.delivery_status}
    </span>
  }, {
    Header: 'Delivery date',
    id: 'delivery_date',
    accessor: props => <span className={"could-be-red " + this.getStateClass(props.delivery_state)}>{new Date(props.delivery_date).toISOString().slice(0, 10)}</span>
  }, {
    Header: 'Delivery dely',
    id: 'delivery_dely',
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

  fetchData(state, instance) {
    this.setState({ loading: true });

    Axios.get('api/orders', {
      page: state.page,
      pageSize: state.pageSize
    }).then((res) => {
        console.log('res >>>>>>>>>>> ', res);
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

  render() { 
    const { data } = this.state;

    return (
      <ReactTable
        columns = {this.columns}
        manual // Forces table not to paginate or sort automatically, so we can handle it server-side
        data = {this.state.data}
        pages = {this.state.pages} // Display the total number of pages
        loading = {this.state.loading} // Display the loading overlay when we need it
        onFetchData = {this.fetchData} // Request new data when things change
        filterable = {false}
        defaultPageSize = {10}
        showPageSizeOptions = {false}
        showPaginationTop = {false}
        showPaginationBottom = {false}
        className = "-striped -highlight" 
      />)
  }
}

export default OrdersTable
