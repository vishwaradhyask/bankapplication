import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios';
import { PopupActions, DialogType, AnimationType } from "react-custom-popup";
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'

import actions from '../actions/mainaction'
import Withdraw from './withdraw/withdraw'
import Deposite from './deposite/deposite';
import FundTransfer from './fundTransfer/funds'
import Profile from './profile/profile';

import User from '../images/user.png';
import Settings from '../images/settings.png'
import DashBord from '../images/dashboard.png'
import DropDown from '../common/dropdown'
import Logout from '../images/logout.png'
import WithdrawPic from '../images/atm-machine.png'
import DeposotePic from '../images/deposit.png'
import FundsPic from '../images/money.png'
import DashMain from './dashmain/dashmain'

import './dash.css'
var loginpol = ''

class Dash extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showProfileDropDown: false,
      settingDrop: false
    }
  }

  componentDidMount() {
    const { main } = this.props
    const { summary } = main
    const { login, cmptype, token } = summary
    loginpol = setInterval(() => {
      this.checkToken()
      this.getaccountDetails()
    }, 1000 * 5);
    this.getaccountDetails('firestTime')
    this.getUserDetails()
    this.props.setSummary('selectedTab', 'dashboard')
  }

  componentWillUnmount() {
    clearInterval(loginpol)
  }

  getUserDetails = () => {
    const { main } = this.props
    const { summary } = main
    const { login, cmptype, token } = summary
    axios.get(`http://sanvish.pythonanywhere.com/get_user_details/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then(res => {
      console.log('userd details:', res)
      if (res.status === 200) {
        this.props.setSummary('userDetails', res.data.body)
      }
    }).catch(res => {
      PopupActions.showAlert({
        title: "Bank",
        type: DialogType.WARNING,
        text: 'something went wrong, while fetching use details!',
        animationType: AnimationType.ZOOM_IN
      })
    })
  }

  getaccountDetails = (type) => {
    const { main } = this.props
    const { summary } = main
    const { login, cmptype, token, dashboard, accountDetails } = summary
    if (type && type === 'firestTime') this.props.setSummary('showLoading', true)
    axios.get(`http://sanvish.pythonanywhere.com/fetch_saving_account`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then(res => {
      const animals = res.data;
      console.log("fect account succ:", res)
      this.props.setSummary('accountDetails', res.data.body[0])
      if (type && type === 'firestTime') this.props.setSummary('showLoading', false)
    }).catch(res => {
      if (type && type === 'firestTime') this.props.setSummary('showLoading', false)
      this.props.setSummary('accountDetails', false)
      console.log("fect account fail:", res)
    })
  }

  checkToken = () => {
    const { main } = this.props
    const { summary } = main
    const { login, cmptype, token, selectedTab } = summary
    console.log('timer called', token)
    axios.post(`http://sanvish.pythonanywhere.com/token_expired/`, {}, {
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then(res => {
      const animals = res.data;
      // console.log(res)
    }).catch(res => {
      PopupActions.showAlert({
        title: "Log In Expiry",
        type: DialogType.DANGER,
        text: 'Log In Expired Pleas log in again',
        animationType: AnimationType.ZOOM_IN
      })
      this.props.setSummary('login', false)
      this.props.setSummary('cmptype', '')
    })
  }

  handleClickUser = () => {
  }

  createSavingAcoount = () => {
    const { main } = this.props
    const { summary } = main
    const { login, cmptype, token, dashboard, userDetails
    } = summary
    const { firstname, lastname, username, emailid, phone, hint } = userDetails
    let payload = {
      "firstname": firstname,
      "lastname": lastname,
      "username": username,
      "emaid": emailid,
      "phone": phone,
      // "hint": hint,
      "balance": 0,
      "transaction": []
    }
    console.log('payload:', payload)
    this.props.setSummary('showLoading', true)
    axios.post(`http://sanvish.pythonanywhere.com/creaet_saving_account/`, payload, {
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then(res => {
      const animals = res.data;
      console.log("createAccount:", res)
      this.props.setSummary('showLoading', false)
      this.getaccountDetails('firestTime')
      PopupActions.showToast({
        text: 'Deposite your first amount',
        type: DialogType.INFO
      })
    }).catch(res => {
      this.props.setSummary('showLoading', false)
      console.log("createAccount error:", res)
      PopupActions.showAlert({
        title: "Bank",
        type: DialogType.WARNING,
        text: 'Somthing went wrong please try again',
        animationType: AnimationType.ZOOM_IN
      })
    })
  }

  handleDeleteAcc = () => {
    const { main } = this.props
    const { summary } = main
    const { login, cmptype, token, dashboard, userDetails
    } = summary
    const { firstname, lastname, username, emailid, phone, hint } = userDetails
    this.props.setSummary('showLoading', true)
    axios.post(`http://sanvish.pythonanywhere.com/Delete_relationship/`, {}, {
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then(res => {
      const animals = res.data;
      console.log("createAccount:", res)
      this.props.setSummary('showLoading', false)
      window.location.reload()
    }).catch(res => {
      this.props.setSummary('showLoading', false)
      console.log("createAccount error:", res)
      PopupActions.showAlert({
        title: "Bank",
        type: DialogType.WARNING,
        text: 'Somthing went wrong please try again',
        animationType: AnimationType.ZOOM_IN
      })
    })
  }

  render() {
    console.log('DAsh props: ', this.props)
    const { main } = this.props
    const { summary } = main
    const { showProfileDropDown, settingDrop } = this.state
    const { login, cmptype, token, selectedTab, userDetails, accountDetails } = summary
    let name = userDetails?.firstname ? userDetails.firstname : ''
    const options = [
      'one', 'two', 'three'
    ];
    const defaultOption = options[0];
    let dropdowndata = [
      {
        'name': (
          <div data-tooltip-id='Log out' data-tooltip-content='Log out' style={{ display: 'flex' }} onClick={() => window.location.reload()}>
            <div>
              <img style={{ height: '20px', width: '20px', marginRight: '5px' }} src={Logout} alt="Logout" />
            </div>
            <div>
              <h4 style={{ margin: 'unset' }} >Log out</h4>
            </div>
            <Tooltip id='Log out' />
          </div>
        )
      },
      {
        'name': (
          <div data-tooltip-id='Profile Settings' data-tooltip-content='Profile Settings' style={{ display: 'flex' }} onClick={() => this.props.setSummary('selectedTab', 'profile')} >
            <div>
              <img style={{ height: '20px', width: '20px', marginRight: '5px' }} src={Logout} alt="Logout" />
            </div>
            <div>
              <h4 style={{ margin: 'unset' }} >Profile Settings</h4>
            </div>
            <Tooltip id='Profile Settings' />
          </div>
        )
      }
    ]

    let settingdropdowndata = [
      {
        'name': (
          <div data-tooltip-id='Delete Relationship With Bank' data-tooltip-content='Delete Relationship With Bank' style={{ display: 'flex' }} onClick={this.handleDeleteAcc}>
            <div>
              <img style={{ height: '20px', width: '20px', marginRight: '5px' }} src={Logout} alt="Logout" />
            </div>
            <div>
              <h4 style={{ margin: 'unset' }} >Delete Relationship With Bank</h4>
            </div>
            <Tooltip id='Delete Relationship With Bank' />
          </div>
        )
      }
    ]

    let cmp = <DashMain />
    if (selectedTab && selectedTab === 'withdraw') cmp = <Withdraw />
    else if (selectedTab && selectedTab === 'deposite') cmp = <Deposite />
    else if (selectedTab && selectedTab === 'transfer') cmp = <FundTransfer />
    else if (selectedTab && selectedTab === 'profile') cmp = <Profile />
    return (
      <div className='dash-board'>
        <div className='header'>
          <div className='header-left'>
            <h4 style={{ margin: '5px 0px 0px 30px' }}>Welcome to Bank</h4>
          </div >
          <div className='header-right'>
            <div>
              <h5 style={{ margin: '12px' }}>Hi, {name}</h5>
            </div>
            <div className='css-pointer' onClick={() => { this.setState({ showProfileDropDown: !showProfileDropDown }) }}>
              <img style={{ height: '25px', width: '25px', margin: '10px 10px 0px 0px' }} src={User} alt="User" />
              <div>
                {showProfileDropDown ? (
                  <DropDown closeSidePanel={() => this.setState({ showProfileDropDown: false })} data={dropdowndata} />
                ) : null}
              </div>
            </div>
            <div className='css-pointer' onClick={() => { this.setState({ settingDrop: !settingDrop }) }}>
              <img style={{ height: '25px', width: '25px', margin: '10px 10px 0px 0px' }} src={Settings} alt="Settings" />
              <div>
                {settingDrop ? (
                  <DropDown closeSidePanel={() => this.setState({ settingDrop: false })} data={settingdropdowndata} />
                ) : null}
              </div>
            </div>
          </div>
        </div >
        {
          !accountDetails ? (
            <div>
              <div className='css-display'>
                <h2>Hello, {name} you dont have saving acoount you would like to create one!</h2>
              </div>
              <div className='css-display'>
                <button onClick={this.createSavingAcoount} className='css-btn-big'>Create</button>
              </div>
            </div>
          ) : (
            <div>
              <div className='dash-body'>
                <div className='side-panle' >
                  <div style={{ height: '30px' }}></div>
                  <div onClick={() => this.props.setSummary('selectedTab', 'dashboard')} className={`each-tab ${selectedTab === 'dashboard' ? 'selected-tab' : ""}`} style={{ display: 'flex', cursor: 'pointer' }}>
                    <div style={{ marginRight: '10px' }}>
                      <img style={{ height: '30px', width: '30px', marginLeft: '30px' }} src={DashBord} alt="DashBord" />
                    </div>
                    <div>
                      <h4 style={{ margin: 'unset', marginBottom: '10px' }}>Dashboard</h4>
                    </div>
                  </div>
                  <div onClick={() => this.props.setSummary('selectedTab', 'withdraw')} className={`each-tab ${selectedTab === 'withdraw' ? 'selected-tab' : ""}`} style={{ display: 'flex', marginTop: '30px', cursor: 'pointer' }}>
                    <div style={{ marginRight: '10px' }}>
                      <img style={{ height: '30px', width: '30px', marginLeft: '30px' }} src={WithdrawPic} alt="DashBord" />
                    </div>
                    <div>
                      <h4 style={{ margin: 'unset', marginBottom: '10px' }}>Withdraw</h4>
                    </div>
                  </div>
                  <div onClick={() => this.props.setSummary('selectedTab', 'deposite')} className={`each-tab ${selectedTab === 'deposite' ? 'selected-tab' : ""}`} style={{ display: 'flex', marginTop: '30px', cursor: 'pointer' }}>
                    <div style={{ marginRight: '10px' }}>
                      <img style={{ height: '30px', width: '30px', marginLeft: '30px' }} src={DeposotePic} alt="DashBord" />
                    </div>
                    <div>
                      <h4 style={{ margin: 'unset', marginBottom: '10px' }}>Deposite</h4>
                    </div>
                  </div>
                  <div onClick={() => this.props.setSummary('selectedTab', 'transfer')} className={`each-tab ${selectedTab === 'transfer' ? 'selected-tab' : ""}`} style={{ display: 'flex', marginTop: '30px', cursor: 'pointer' }}>
                    <div style={{ marginRight: '10px' }}>
                      <img style={{ height: '30px', width: '30px', marginLeft: '30px' }} src={FundsPic} alt="DashBord" />
                    </div>
                    <div>
                      <h4 style={{ margin: 'unset', marginBottom: '10px' }}>Funds Transfer</h4>
                    </div>
                  </div>
                </div>
                <div className='right-side-panel'>
                  {cmp}
                </div>
              </div>
            </div >
          )
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(Dash)