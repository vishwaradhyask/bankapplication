import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/mainaction'
import axios from 'axios';
import { PopupActions, DialogType, AnimationType } from "react-custom-popup";

import './fund.css'
class funds extends Component {
  constructor(props) {
    super(props)

    this.state = {
      amount: '',
      showWarning: false,
      accno: ''
    }
  }

  handleonchnage = (e, type) => {
    if (type && type === 'ac') {
      this.setState({
        accno: e.target.value
      })
      return
    }
    const { showWarning, amount } = this.state
    const { main } = this.props
    const { summary } = main
    const { login, cmptype, token, selectedTab, userDetails, accountDetails } = summary
    const { balance, transaction } = accountDetails
    var valid = !isNaN(e.target.value);
    if (!valid) {
      this.setState({
        amount: ''
      })
      PopupActions.showToast({
        text: 'Enter valid amount!',
        type: DialogType.WARNING,
        timeoutDuration: 1000 * 2
      })
    } else {
      this.setState({
        amount: e.target.value
      })
      let val = parseFloat(e.target.value)
      if (val > 49999) {
        PopupActions.showToast({
          text: 'Note Allowed to deposite more then ₹ 49,999.00 /-',
          type: DialogType.WARNING,
          timeoutDuration: 1000 * 2
        })
        this.setState({ showWarning: true })
      }
      else if (showWarning) this.setState({ showWarning: false })
    }
  }
  render() {
    const { amount, showWarning, accno } = this.state
    return (
      <div className='funds-transfer css-display'>
        <div className='funds-body'>
          <div className='css-display'>
            <h2>Funds Tranfer Within Bank</h2>
          </div>
          <div className='css-normal-notes css-display'>
            One Time Fund Transfer Should not exceed more then ₹ 49999.00 /-
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
              <input onChange={(e) => this.handleonchnage(e, 'un')} value={amount} placeholder='Enter the Amount' className='ipt' type="text" />
            </div>
          </div>
          {showWarning ? (
            <div className='css-warning-notes css-display'>
              Note: Amount Exceeding one time deposite limit, please make more trasaction if you want to deposite more!
            </div>
          ) : null}
          <div>
            <div className={showWarning || amount === '' ? 'css-disable' : ''} style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginTop: '60px' }}>
              <input style={{ margin: '5px 10px 0px 0px'}} onChange={(e) => this.handleonchnage(e, 'ac')} value={accno} placeholder='Enter ACC NO' className='ipt' type="text" />
              <button onClick={this.handleDeposite} className='reg-btn'>Validate</button>
            </div>
            <div className={showWarning || amount === '' ? 'css-disable' : ''} style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginTop: '60px' }}>
              <button onClick={this.handleDeposite} className='reg-btn'>Submit</button>
            </div>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(funds)