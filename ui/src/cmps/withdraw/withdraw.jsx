import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/mainaction'
import axios from 'axios';
import { PopupActions, DialogType, AnimationType } from "react-custom-popup";


import './with.css'

class withdraw extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showWarning: false,
      amount: ''
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
      if (val > balance){
        PopupActions.showToast({
          text: 'Insufficient Funds! Either deposite are select with available Balance!',
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

  handleWithdraw = () => {
    const { showWarning, amount } = this.state
    const { main } = this.props
    const { summary } = main
    const { login, cmptype, token, dashboard, accountDetails } = summary
    const { balance, transaction } = accountDetails
    this.props.setSummary('showLoading', true)
    axios.post(`http://sanvish.pythonanywhere.com/withdraw_saving_account/`, {
      'amount': parseFloat(amount)
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
        text: 'Failed To Withdraw please try again!',
        animationType: AnimationType.ZOOM_IN
      })
      console.log("with account fail:", res)
    })
  }

  render() {
    const { showWarning, amount } = this.state
    const { main } = this.props
    const { summary } = main
    const { login, cmptype, token, selectedTab, userDetails, accountDetails } = summary
    const { balance, transaction } = accountDetails

    return (
      <div className='withdraw css-display'>
        <div className='withdraw-body'>
          <div className='with-header'>
            <h2>Withdraw Your Money</h2>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <input onChange={(e) => this.handleonchnage(e, 'un')} value={amount} placeholder='Enter the Amount' className='ipt' type="text" />
          </div>
          <div className='css-normal-notes css-display' style={{ margin: '10px' }}>
            Available Balance is: ₹ {parseFloat(balance).toFixed(2)} /-
          </div>
          {showWarning ? (
            <div className='css-warning-notes css-display' style={{ margin: '10px' }}>
              {`Note: Entered amount is more then available balance`}
            </div>
          ) : null}
          <div>
            <div className={showWarning || amount === '' ? 'css-disable' : ''} style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginTop: '60px' }}>
              <button onClick={this.handleWithdraw} className='reg-btn'>Submit</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(withdraw)