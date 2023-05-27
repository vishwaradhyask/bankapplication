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
      accno: '',
      validateAccSucc: false,
      enableValidatebtn: false,
      lowbalance: false,
    }
  }

  componentDidMount() {
    this.props.setSummary('transAccDetails', '')
  }

  handleonchnage = (e, type) => {
    if (type && type === 'ac') {
      var Nvalid = !isNaN(e.target.value);
      if (!Nvalid) {
        PopupActions.showToast({
          text: 'Enter valid Acc No!',
          type: DialogType.WARNING,
          timeoutDuration: 1000 * 2
        })
      } else {
        if (this.state.accno.length >= 10) {
          PopupActions.showToast({
            text: 'Acc No will have only 10 digit',
            type: DialogType.WARNING,
            timeoutDuration: 1000 * 2
          })
        }
        this.setState({
          accno: e.target.value
        })
      }
    } else {
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

  handleVliadte = () => {
    const { showWarning, amount } = this.state
    const { main } = this.props
    const { summary } = main
    const { login, cmptype, token, dashboard, accountDetails, transAccDetails } = summary
    const { balance, transaction, accountnumber } = accountDetails
    if (parseInt(this.state.accno) === accountnumber) {
      PopupActions.showAlert({
        title: "Bank",
        type: DialogType.WARNING,
        text: 'You Can not Transfer To Your Account!',
        animationType: AnimationType.ZOOM_IN
      })
      return
    }
    this.props.setSummary('showLoading', true)
    axios.post(`http://localhost:9990/validate_acc/`, {
      'account_no': parseInt(this.state.accno)
    }, {
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then(res => {
      const animals = res.data;
      this.props.setSummary('showLoading', false)
      this.props.setSummary('transAccDetails', res.data.body[0])
      console.log("with validate acc no pass succ:", res)
      this.setState({
        validateAccSucc: true
      })
    }).catch(res => {
      this.props.setSummary('showLoading', false)
      PopupActions.showAlert({
        title: "Bank",
        type: DialogType.WARNING,
        text: 'Could Not Found user bound to this ACC NO!',
        animationType: AnimationType.ZOOM_IN
      })
      console.log("with valicdate acc no fail:", res)
    })
  }

  handleTranfer = () => {
    const { showWarning, amount } = this.state
    const { main } = this.props
    const { summary } = main
    const { login, cmptype, token, dashboard, accountDetails, transAccDetails } = summary
    const { balance, transaction, accountnumber } = accountDetails
    if (parseInt(amount) === 0) {
      PopupActions.showAlert({
        title: "Bank",
        type: DialogType.WARNING,
        text: 'Required atleast Amount to be transfer is ₹ 1.00 /-',
        animationType: AnimationType.ZOOM_IN
      })
      return
    }
    this.props.setSummary('showLoading', true)
    axios.post(`http://localhost:9990/transaction/`, {
      'account_no': parseInt(this.state.accno),
      "amnt": parseInt(this.state.amount)
    }, {
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then(res => {
      const animals = res.data;
      this.props.setSummary('showLoading', false)
      console.log("with validate acc no pass succ:", res)
      PopupActions.showAlert({
        title: "Bank",
        type: DialogType.SUCCESS,
        text: 'Succuss!',
        animationType: AnimationType.ZOOM_IN
      })
      this.setState({
        amount: '',
        showWarning: false,
        accno: '',
        validateAccSucc: false,
        enableValidatebtn: false,
        lowbalance: false
      })
      this.props.setSummary('transAccDetails', '')
      setTimeout(() => {
        this.toastupdatedbalance()
      }, 1000 * 5);
    }).catch(res => {
      this.props.setSummary('showLoading', false)
      PopupActions.showAlert({
        title: "Bank",
        type: DialogType.WARNING,
        text: 'Failed to Transfer please try later',
        animationType: AnimationType.ZOOM_IN
      })
      console.log("with valicdate acc no fail:", res)
    })
  }

  render() {
    const { main } = this.props
    const { summary } = main
    const { login, cmptype, token, dashboard, accountDetails, transAccDetails } = summary
    const { balance } = accountDetails
    const { amount, showWarning, accno, validateAccSucc, enableValidatebtn, lowbalance } = this.state
    if (!enableValidatebtn && this.state.accno.length === 10) this.setState({ enableValidatebtn: true })
    else if ((this.state.accno.length > 10 || this.state.accno.length < 10) && enableValidatebtn) this.setState({ enableValidatebtn: false })
    if (amount !== '' && parseInt(amount) > balance && !lowbalance) this.setState({ lowbalance: true })
    else if (amount !== '' && parseInt(amount) < balance && lowbalance) this.setState({ lowbalance: false })
    else if (amount === '' && lowbalance) this.setState({ lowbalance: false })
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
          <div className='css-normal-notes css-display' style={{ margin: '10px' }}>
            Available Balance is: ₹ {parseFloat(balance).toFixed(2)} /-
          </div>
          {lowbalance ? (
            <div className='css-warning-notes css-display' style={{ margin: '10px' }}>
              {`Note: Entered amount is more then available balance`}
            </div>
          ) : null}
          {showWarning ? (
            <div className='css-warning-notes css-display'>
              Note: Amount Exceeding one time Transfer limit, please make more trasaction if you want to deposite more!
            </div>
          ) : null}
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginTop: '60px' }}>
              <input style={{ margin: '5px 10px 0px 0px' }} onChange={(e) => this.handleonchnage(e, 'ac')} value={accno} placeholder='Enter ACC NO' className={showWarning || amount === '' ? 'ipt css-disable' : 'ipt'} type="text" />
              <button onClick={this.handleVliadte} className={enableValidatebtn ? 'reg-btn' : 'reg-btn css-disable'} >Validate</button>
            </div>
            {transAccDetails && Object.keys(transAccDetails).length > 0 ? (
              <div className='css-display'>
                <div>
                  <h4 style={{ margin: 'unset', marginRight: '10px' }}>Banificier Name:</h4>
                </div>
                <div>
                  <h4 style={{ color: 'green', margin: 'unset' }}>{transAccDetails.firstname} {transAccDetails.lastname}</h4>
                </div>
              </div>
            ) : null}
            <div className={validateAccSucc ? '' : 'css-disable'} style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
              <button onClick={this.handleTranfer} className='reg-btn'>Submit</button>
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