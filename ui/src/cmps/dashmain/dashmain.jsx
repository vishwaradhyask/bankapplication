import React, { Component } from 'react'
import { connect } from 'react-redux'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'

import actions from '../../actions/mainaction'
import axios from 'axios';
import { PopupActions, DialogType, AnimationType } from "react-custom-popup";
import ReactTable from "react-table";
import "react-table/react-table.css";

import Rupee from '../../images/rupee.png'
import './dashmain.css'

class dashmain extends Component {
  render() {
    const { main } = this.props
    const { summary } = main
    const { login, cmptype, token, selectedTab, userDetails, accountDetails } = summary
    const { balance, transaction, accountnumber } = accountDetails
    const data = [{
      name: 'Ayaan',
      age: 26
    }, {
      name: 'Ahana',
      age: 22
    }, {
      name: 'Peter',
      age: 40
    }, {
      name: 'Virat',
      age: 30
    }, {
      name: 'Rohit',
      age: 32
    }, {
      name: 'Dhoni',
      age: 37
    }, {
      name: 'Dhoni',
      age: 37
    }, {
      name: 'Dhoni',
      age: 37
    }, {
      name: 'Dhoni',
      age: 37
    }, {
      name: 'Dhoni',
      age: 37
    }, {
      name: 'Dhoni',
      age: 37
    }, {
      name: 'Dhoni',
      age: 37
    }]

    const columns = [{
      Header: 'Sl No',
      minWidth: 20,
      accessor: 'Sl No',
      Cell: (props) => {
        return (
          <div data-tooltip-id={props.value} data-tooltip-content={props.value}>
            <div >{props.value}</div>
            <Tooltip id={props.value} />
          </div>
        )
      },
    }, {
      Header: 'Date',
      accessor: 'Date',
      minWidth: 100,
      Cell: (props) => {
        return (
          <div data-tooltip-id={props.value} data-tooltip-content={props.value}>
            <div >{props.value}</div>
            <Tooltip id={props.value} />
          </div>
        )
      },
    }, {
      Header: 'Description',
      accessor: 'Description',
      minWidth: 150,
      Cell: (props) => {
        return (
          <div data-tooltip-id={props.value} data-tooltip-content={props.value}>
            <div >{props.value}</div>
            <Tooltip id={props.value} />
          </div>
        )
      },
    }, {
      Header: 'Deducted',
      accessor: 'Deducted',
      minWidth: 50,
      Cell: (props) => {
        return (
          <div data-tooltip-id={props.value} data-tooltip-content={props.value}>
            <div >{props.value}</div>
            <Tooltip id={props.value} />
          </div>
        )
      },
    }, {
      Header: 'Credited',
      accessor: 'Credited',
      minWidth: 50,
      Cell: (props) => {
        return (
          <div data-tooltip-id={props.value} data-tooltip-content={props.value}>
            <div >{props.value}</div>
            <Tooltip id={props.value} />
          </div>
        )
      },
    }, {
      Header: 'Balance',
      accessor: 'Balance',
      minWidth: 50,
      Cell: (props) => {
        return (
          <div data-tooltip-id={props.value} data-tooltip-content={props.value}>
            <div >{props.value}</div>
            <Tooltip id={props.value} />
          </div>
        )
      },
    }]

    // let dableData = []
    // transaction.map((e) => {
    //   let d = 
    // })

    return (
      <div className='dash-main'>
        <div className='upper-side'>
          <div style={{ alignItems: 'unset' }} className='balance-tab'>
            <div className='css-display'>
              <h4>Your Balance</h4>
            </div>
            <div className='css-display'>
              <div>
                <img style={{ height: '25px', width: '25px', margin: '16px 5px 0px 0px' }} src={Rupee} alt="Rupee" />
              </div>
              <div className='css-elapsis'>
                <h3 style={{ color: 'green', fontWeight: 'bold', marginBottom: '10px' }}>{parseFloat(balance).toFixed(2)} /-</h3>
              </div>
            </div>
          </div>
          <div style={{ marginLeft: '10px' }} >
            <div>
              <h5>
                Important Tips:
              </h5>
            </div>
            <ul>
              <li>
                Welcome to Your Bank
              </li>
              <li>
                You can Deposite, Withdraw or you can do Fund Transfer
              </li>
              <li>
                {`Developed By Sangeetha S H & Vishwaradhya Sk`}
              </li>
              <li>
                Hope you like it!, Happy Banking
              </li>
              <li>
                <div style={{ display: 'flex' }}>
                  <div style={{ marginRight: '5px' }}>
                    Your ACC No:
                  </div>
                  <div style={{ fontWeight: 'bold' }}>
                    {accountnumber}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className='lower-side'>
          <ReactTable
            data={transaction}
            columns={columns}
            showPaginationBottom={false}
            style={{ height: 'inherit' }}
            minRows={0}
            defaultPageSize={10000}
          />
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  setSummary: (key, value) => dispatch(actions.setSummary(key, value)),
})
const mapStateToProps = state => ({
  main: state.Main,
})

export default connect(mapStateToProps, mapDispatchToProps)(dashmain)