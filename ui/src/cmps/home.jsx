import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../actions/mainaction'
import Reg from './reg';
import Dash from './dash'
import './home.css'

class Home extends Component {

  render() {
    console.log('this.props: ', this.props)
    const { main } = this.props
    const { summary } = main
    const {login, cmptype} = summary
    let cmp = (<div>something went wrong <a href='#' onClick={() => window.location.reload()} >Refresh</a> </div>)
    if(!login && cmptype === ''){
      cmp = <Reg />
    }else if(login && cmptype === 'dash'){
      cmp = <Dash />
    }
    return (
      <div className='home'>
        {cmp}
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
export default connect(mapStateToProps, mapDispatchToProps)(Home)
