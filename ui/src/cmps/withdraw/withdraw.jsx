import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/mainaction'
import axios from 'axios';
import { PopupActions, DialogType, AnimationType } from "react-custom-popup";


import './with.css'

class withdraw extends Component {
  render() {
    return (
      <div className='withdraw css-display'>
        <div className='withdraw-body'>

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