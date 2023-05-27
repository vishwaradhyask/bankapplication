import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../actions/mainaction'
import './reg.css'
import Bank_iconfrom from '../images/bank_icon.jpg'
import { PopupActions, DialogType, AnimationType } from "react-custom-popup";
import axios from 'axios';


class Reg extends Component {
  constructor(props) {
    super(props)

    this.state = {
      un: '',
      pw: '',
      type: 'login',
      fn: '',
      ln: '',
      run: '',
      rpw: '',
      ei: '',
      pn: '',
      ht: '',
      fun: '',
      fht: '',
      fpw: '',
      fcpw: '',
    }
  }

  handlelog = (crf) => {

  }

  handleLogin = () => {
    const { un, pw } = this.state
    if (un === '' || pw === '') {
      PopupActions.showAlert(
        {
          title: "Log In",
          type: DialogType.WARNING,
          text: "username or password can not empty!",
          animationType: AnimationType.ZOOM_IN
        }
      )
      return
    }
    this.props.setSummary('showLoading', true)
    axios.post(`http://sanvish.pythonanywhere.com/api-token-auth/`, {
      "username": un,
      "password": pw
    })
      .then(res => {
        const animals = res.data;
        console.log(res)
        this.props.setSummary('showLoading', false)
        if (res.status === 200) {
          this.props.setSummary('login', true)
          this.props.setSummary('token', res.data.token)
          this.props.setSummary('showLoading', false)
          PopupActions.showAlert({
            title: "Log In",
            type: DialogType.SUCCESS,
            text: "Success!",
            animationType: AnimationType.ZOOM_IN
          })
          this.props.setSummary('cmptype', 'dash')
        }
      }).catch(res => {
        console.log('cathc:', res)
        this.props.setSummary('showLoading', false)
        let msg = "Entered Username or Password Wrong, please try again!"
        if (res.code === "ERR_NETWORK") msg = 'There is no network'
        PopupActions.showAlert({
          title: "Log In",
          type: DialogType.WARNING,
          text: msg,
          animationType: AnimationType.ZOOM_IN
        })
      })

  }

  handleonchnage = (e, type) => {
    if (type === 'un') this.setState({ un: e.target.value })
    else if (type === 'pw') this.setState({ pw: e.target.value })
    else if (type === 'fn') this.setState({ fn: e.target.value })
    else if (type === 'ln') this.setState({ ln: e.target.value })
    else if (type === 'run') this.setState({ run: e.target.value })
    else if (type === 'rpw') this.setState({ rpw: e.target.value })
    else if (type === 'ei') this.setState({ ei: e.target.value })
    else if (type === 'pn') this.setState({ pn: e.target.value })
    else if (type === 'ht') this.setState({ ht: e.target.value })
    else if (type === 'fun') this.setState({ fun: e.target.value })
    else if (type === 'fht') this.setState({ fht: e.target.value })
    else if (type === 'fpw') this.setState({ fpw: e.target.value })
    else if (type === 'fcpw') this.setState({ fcpw: e.target.value })

  }

  handleregister = () => {
    const { fn, ln, run, rpw, ei, pn, ht } = this.state
    let t = ''
    if (ht === '') t = 'Hint Cant empty!'
    if (pn === '') t = 'Phine number Cant empty!'
    if (ei === '') t = 'Email Id Cant empty!'
    if (rpw === '') t = 'Password name Cant empty!'
    if (run === '') t = 'User name Cant empty!'
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

    const reguarExp = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');
    let PwdTest = reguarExp.test(rpw)
    if (!PwdTest) {
      PopupActions.showAlert({
        title: "Invalid Password",
        type: DialogType.WARNING,
        text: 'Passowrd should include atleast 1 upper case, 1 lower case, 1 digit, 1 specail charactor and inbetween 8 to 30 charactors',
        animationType: AnimationType.ZOOM_IN
      })
      this.setState({
        rpw: ''
      })
      return
    }
    this.props.setSummary('showLoading', true)
    axios.post(`http://sanvish.pythonanywhere.com/register/`, {
      "firstname": fn,
      "lastname": ln,
      "username": run,
      "password": rpw,
      "emaid": ei,
      "phone": pn,
      "hint": ht
    })
      .then(res => {
        const animals = res.data;
        console.log(res)
        // this.props.setSummary('showLoading', false)
        if (res.status === 200) {
          // this.props.setSummary('login', true)
          // this.props.setSummary('token', res.data.token)
          this.props.setSummary('showLoading', false)
          PopupActions.showAlert({
            title: "Log In",
            type: DialogType.SUCCESS,
            text: "Success!, please Log In Again",
            animationType: AnimationType.ZOOM_IN
          })
          this.setState({
            type: 'login',
            fn: '',
            ln: '',
            run: '',
            rpw: '',
            ei: '',
            pn: '',
            ht: '',
          })
        }
      }).catch(res => {
        console.log('cathc:', res)
        this.props.setSummary('showLoading', false)
        let msg = "Something Went wrong please try again!"
        if (res.response.data.status === 403) msg = 'Username Taken please try another one!'
        PopupActions.showAlert({
          title: "Log In",
          type: DialogType.WARNING,
          text: msg,
          animationType: AnimationType.ZOOM_IN
        })
      })
  }

  handleResetPwd = () => {
    const { fun, fht, fpw, fcpw } = this.state
    let t = ''
    if (fpw === '') t = 'Pasword Cant empty!'
    if (fht === '') t = 'Hint Cant empty!'
    if (fun === '') t = 'User name Cant empty!'
    if (t !== '') {
      PopupActions.showAlert({
        title: "Registration",
        type: DialogType.WARNING,
        text: t,
        animationType: AnimationType.ZOOM_IN
      })
      return
    }

    const reguarExp = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');
    let PwdTest = reguarExp.test(fpw)
    if (!PwdTest) {
      PopupActions.showAlert({
        title: "Invalid Password",
        type: DialogType.WARNING,
        text: 'Passowrd should include atleast 1 upper case, 1 lower case, 1 digit, 1 specail charactor and inbetween 8 to 30 charactors',
        animationType: AnimationType.ZOOM_IN
      })
      this.setState({
        fpw: ''
      })
      return
    }
    if (fpw !== fcpw) {
      PopupActions.showAlert({
        title: "Invalid Password",
        type: DialogType.WARNING,
        text: 'Passowrd and Confirm Password wont match!',
        animationType: AnimationType.ZOOM_IN
      })
      this.setState({
        fcpw: ''
      })
      return
    }
    this.props.setSummary('showLoading', true)
    axios.post(`http://sanvish.pythonanywhere.com/forgot_pwd/`, {
      "username": fun,
      "password": fpw,
      "hint": fht
    })
      .then(res => {
        const animals = res.data;
        console.log(res)
        this.props.setSummary('showLoading', false)
        if (res.status === 200) {
          // this.props.setSummary('login', true)
          // this.props.setSummary('token', res.data.token)
          this.props.setSummary('showLoading', false)
          PopupActions.showAlert({
            title: "Log In",
            type: DialogType.SUCCESS,
            text: "Success!, please Log In Again",
            animationType: AnimationType.ZOOM_IN
          })
          this.setState({
            type: 'login',
            fun: '',
            fpw: '',
            fht: '',
            fcpw: '',
          })
        }
      }).catch(res => {
        console.log('cathc:', res)
        this.props.setSummary('showLoading', false)
        let msg = "Something Went Wrong!"
        if (res.response.status === 404) msg = 'provided wrong hint answare!'
        else if (res.response.status === 403) msg = 'Usern not found!'
        PopupActions.showAlert({
          title: "Log In",
          type: DialogType.WARNING,
          text: msg,
          animationType: AnimationType.ZOOM_IN
        })
      })
  }


  render() {
    const { type, fn, ln, run, rpw, ei, pn, ht, un, pw, fun, fht, fpw, fcpw } = this.state
    return (
      <div className='reg'>
        <div style={{ display: 'flex', justifyContent: 'center' }} className='reg-header'>
          <h1 className='reg-header-h1'>Welcome To Bank</h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
          <div className='reg-panel'>
            <div style={{ width: '46%' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img className='bank-icon' src={Bank_iconfrom} alt="" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                {type === 'login' ? 'Nice To See You Again' : type === 'register' ? 'Hello there!' : 'Please enter the details to reset password'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h3>
                  {type === 'login' ? 'Welcome Back Log in To Get  Started!' : type === 'register' ? 'Fill The Details To create Account' : ''}
                </h3>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {type === 'login' ? (
                  <div>
                    New User?
                    <a onClick={() => this.setState({ type: 'register' })} href="#"> Sign Up</a>
                  </div>
                ) : type === 'register' ? (
                  <div>
                    Already a User?
                    <a onClick={() => this.setState({ type: 'login' })} href="#">Log In</a>
                  </div>
                ) : (
                  <div>
                    <a onClick={() => this.setState({ type: 'login' })} href="#">Back</a>
                  </div>
                )
                }
              </div>
              <div>
                {
                  type === 'register' ? (
                    <div>
                      <h6 style={{ margin: '10px 0px 0px 10px', color: 'red' }}>Note:</h6>
                      <h6 style={{ margin: '5px 0px 0px 20px', color: 'red' }}>Hint is used to reset the password please remember it!</h6>
                    </div>
                  ) : null
                }
              </div>
            </div>
            <div style={{ width: '54%' }}>
              {type === 'login' ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}><h2>Log In</h2></div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                    <input onChange={(e) => this.handleonchnage(e, 'un')} value={un} placeholder='Username' className='ipt' type="text" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <input onChange={(e) => this.handleonchnage(e, 'pw')} value={pw} placeholder='Password' className='ipt' type="password" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 103px 0px 0px' }}>
                    <a onClick={() => this.setState({ type: 'forgot' })} href="#">Forgot Passowrd?</a>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                    <button onClick={this.handleLogin} className='reg-btn'>Submit</button>
                  </div>
                </div>
              ) : type === 'register' ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}><h2 style={{ margin: 'unset' }}>Create Account</h2></div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <input onChange={(e) => this.handleonchnage(e, 'fn')} value={fn} placeholder='First name' className='ipt' type="text" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <input onChange={(e) => this.handleonchnage(e, 'ln')} value={ln} placeholder='Last Name' className='ipt' type="text" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <input onChange={(e) => this.handleonchnage(e, 'run')} value={run} placeholder='Username' className='ipt' type="text" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <input onChange={(e) => this.handleonchnage(e, 'rpw')} value={rpw} placeholder='Password' className='ipt' type="password" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <input onChange={(e) => this.handleonchnage(e, 'ei')} value={ei} placeholder='Email id' className='ipt' type="email" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <input onChange={(e) => this.handleonchnage(e, 'pn')} value={pn} placeholder='Phone Number' className='ipt' type="text" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <input onChange={(e) => this.handleonchnage(e, 'ht')} value={ht} placeholder='Hint' className='ipt' type="text" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <button onClick={this.handleregister} className='reg-btn'>Submit</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}><h2 style={{ margin: 'unset' }}>Reset Password</h2></div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <input onChange={(e) => this.handleonchnage(e, 'fun')} value={fun} placeholder='Username' className='ipt' type="text" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <input onChange={(e) => this.handleonchnage(e, 'fht')} value={fht} placeholder='Hint' className='ipt' type="text" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <input onChange={(e) => this.handleonchnage(e, 'fpw')} value={fpw} placeholder='Passowrd' className='ipt' type="password" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <input onChange={(e) => this.handleonchnage(e, 'fcpw')} value={fcpw} placeholder='Confirm Passowrd' className='ipt' type="text" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button onClick={this.handleResetPwd} className='reg-btn'>Submit</button>
                  </div>
                </div>
              )}
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


// export default withRouter(Backup)
export default connect(mapStateToProps, mapDispatchToProps)(Reg)