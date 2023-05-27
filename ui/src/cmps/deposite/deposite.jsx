import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/mainaction'
import axios from 'axios';
import { PopupActions, DialogType, AnimationType } from "react-custom-popup";

import './depo.css'

class deposite extends Component {
  constructor(props) {
    super(props)

    this.state = {
      amount: '',
      showWarning: false
    }
  }
  handleonchnage = (e) => {
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
  toastupdatedbalance = () => {
    const { main } = this.props
    const { summary } = main
    const { login, cmptype, token, dashboard, accountDetails } = summary
    const { balance, transaction } = accountDetails
    PopupActions.showToast({
      text: `Updated Balance is: ₹ ${parseFloat(balance).toFixed(2)} /-`,
      type: DialogType.INFO,
      timeoutDuration: 1000 * 5
    })
  }

  handleDeposite = () => {
    const { showWarning, amount } = this.state
    const { main } = this.props
    const { summary } = main
    const { login, cmptype, token, dashboard, accountDetails } = summary
    const { balance, transaction } = accountDetails
    this.props.setSummary('showLoading', true)
    axios.post(`http://sanvish.pythonanywhere.com/deposite_saving_account/`, {
      'balance': parseFloat(amount)
    }, {
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then(res => {
      this.setState({
        amount: ''
      })
      const animals = res.data;
      this.props.setSummary('showLoading', false)
      console.log("with account succ:", res)
      PopupActions.showAlert({
        title: "Bank",
        type: DialogType.INFO,
        text: 'Success!',
        animationType: AnimationType.ZOOM_IN
      })
      setTimeout(() => {
        this.toastupdatedbalance()
      }, 1000 * 5)
    }).catch(res => {
      this.setState({
        amount: ''
      })
      this.props.setSummary('showLoading', false)
      PopupActions.showAlert({
        title: "Bank",
        type: DialogType.WARNING,
        text: 'Failed To Deposite please try again!',
        animationType: AnimationType.ZOOM_IN
      })
      console.log("with account fail:", res)
    })
  }

  render() {
    const { amount, showWarning } = this.state
    return (
      <div className='depo-main css-display'>
        <div className='depo-body'>
          <div className='depo-header css-display'>
            <h2>Deposite Money</h2>
          </div>
          <div className='css-normal-notes css-display'>
            One Time Deposite Should not exceed more then ₹ 49999.00 /-
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <input onChange={(e) => this.handleonchnage(e, 'un')} value={amount} placeholder='Enter the Amount' className='ipt' type="text" />
          </div>
          {showWarning ? (
            <div className='css-warning-notes css-display'>
              Note: Amount Exceeding one time deposite limit, please make more trasaction if you want to deposite more!
            </div>
          ) : null}
          <div>
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

export default connect(mapStateToProps, mapDispatchToProps)(deposite)