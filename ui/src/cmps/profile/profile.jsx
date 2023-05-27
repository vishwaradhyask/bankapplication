import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/mainaction'
import axios from 'axios';
import { PopupActions, DialogType, AnimationType } from "react-custom-popup";


import './pro.css'

class profile extends Component {

  constructor(props) {
    super(props)

    this.state = {
      fn: '',
      ln: '',
      pn: '',
      ei: "",
      ht: ''
    }
  }

  componentDidMount() {
    this.getUserDetails()
  }

  handleonchnage = (e, type) => {
    if (type === 'fn') {
      this.setState({
        fn: e.target.value
      })
    } else if (type === 'ln') {
      this.setState({
        ln: e.target.value
      })
    } else if (type === 'pn') {
      this.setState({
        pn: e.target.value
      })
    } else if (type === 'ei') {
      this.setState({
        ei: e.target.value
      })
    } else if (type === 'ht') {
      this.setState({
        ht: e.target.value
      })
    }
  }

  handleupdate = () => {
    const { main } = this.props
    const { summary } = main
    const { login, cmptype, token, selectedTab, userDetails, accountDetails } = summary
    const { balance, transaction, accountnumber } = accountDetails
    const { firstname, lastname, emailid, hint, phone } = userDetails
    const { fn, ln, ei, pn, ht } = this.state
    let t = ''
    if (ht === '') t = 'Hint Cant empty!'
    if (pn === '') t = 'Phine number Cant empty!'
    if (ei === '') t = 'Email Id Cant empty!'
    if (ln === '') t = 'Last name Cant empty!'
    if (fn === '') t = 'First name Cant empty!'
    if (t !== '') {
      PopupActions.showAlert({
        title: "Registration",
        type: DialogType.WARNING,
        text: t,
        animationType: AnimationType.ZOOM_IN
      })
      return
    }

    let hintcheck = /^[a-zA-Z]+$/.test(ht);
    if (!hintcheck) {
      PopupActions.showAlert({
        title: "Invalid Hint",
        type: DialogType.WARNING,
        text: 'Hint only accepts strings',
        animationType: AnimationType.ZOOM_IN
      })
      this.setState({
        ht: ''
      })
      return
    }

    let isnum = /^\d+$/.test(pn);
    if (!isnum || pn.length !== 10) {
      PopupActions.showAlert({
        title: "Invalid Phone Number",
        type: DialogType.WARNING,
        text: 'Enter valid Phone Number',
        animationType: AnimationType.ZOOM_IN
      })
      this.setState({
        pn: ''
      })
      return
    }

    const reguarExpEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    let EmailTest = reguarExpEmail.test(ei)
    if (!EmailTest) {
      PopupActions.showAlert({
        title: "Invalid Email Id",
        type: DialogType.WARNING,
        text: 'Enter valid email id',
        animationType: AnimationType.ZOOM_IN
      })
      this.setState({
        ei: ''
      })
      return
    }

    this.props.setSummary('showLoading', true)
    axios.post(`http://localhost:9990/uodate_profile/`, {
      fn,
      ln,
      ei,
      pn,
      ht
    }, {
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then(res => {
      const animals = res.data;
      this.props.setSummary('showLoading', false)
      this.getUserDetails()
      PopupActions.showAlert({
        title: "Bank",
        type: DialogType.SUCCESS,
        text: 'Success!',
        animationType: AnimationType.ZOOM_IN
      })

    }).catch(res => {
      this.props.setSummary('showLoading', false)
      PopupActions.showAlert({
        title: "Bank",
        type: DialogType.WARNING,
        text: 'Could Not update details try agian!',
        animationType: AnimationType.ZOOM_IN
      })
      console.log("with valicdate acc no fail:", res)
    })
  }

  getUserDetails = () => {
    const { main } = this.props
    const { summary } = main
    const { login, cmptype, token } = summary
    axios.get(`http://localhost:9990/get_user_details/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then(res => {
      console.log('userd details:', res)
      if (res.status === 200) {
        this.props.setSummary('userDetails', res.data.body)
        this.setState({
          fn: res.data.body.firstname,
          ln: res.data.body.lastname,
          pn: res.data.body.phone,
          ei: res.data.body.emailid,
          ht: res.data.body.hint
        })
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


  render() {
    const { fn, ln, ei, pn, ht } = this.state
    return (
      <div className='profile css-display'>
        <div className='profile-body'>
          <h2 className='css-display'>Edit Your Profile Details</h2>
          <div>
            <div>
            </div>
            <div style={{ marginTop: '10px' }} className='css-display'>
              <div>
                <div>
                  <label htmlFor="">First Name:</label>
                </div>
                <div>
                  <input onChange={(e) => this.handleonchnage(e, 'fn')} value={fn} placeholder='First Name' className={'ipt'} type="text" />
                </div>
              </div>
            </div>
            <div style={{ marginTop: '10px' }} className='css-display'>
              <div>
                <div>
                  <label htmlFor="">Last Name:</label>
                </div>
                <div>
                  <input onChange={(e) => this.handleonchnage(e, 'ln')} value={ln} placeholder='Last Name' className={'ipt'} type="text" />
                </div>
              </div>
            </div>
            <div style={{ marginTop: '10px' }} className='css-display'>
              <div>
                <div>
                  <label htmlFor="">Phone Number:</label>
                </div>
                <div>
                  <input onChange={(e) => this.handleonchnage(e, 'pn')} value={pn} placeholder='Phone Number' className={'ipt'} type="text" />
                </div>
              </div>
            </div>
            <div style={{ marginTop: '10px' }} className='css-display'>
              <div>
                <div>
                  <label htmlFor="">Email ID:</label>
                </div>
                <div>
                  <input onChange={(e) => this.handleonchnage(e, 'ei')} value={ei} placeholder='Email ID' className={'ipt'} type="text" />
                </div>
              </div>
            </div>
            <div style={{ marginTop: '10px' }} className='css-display'>
              <div>
                <div>
                  <label htmlFor="">Hint:</label>
                </div>
                <div>
                  <input onChange={(e) => this.handleonchnage(e, 'ht')} value={ht} placeholder='Hint' className={'ipt'} type="text" />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
              <button onClick={this.handleupdate} className='reg-btn'>Submit</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(profile)