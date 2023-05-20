import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import './dropdown.css'
export default class dropdown extends Component {

	componentDidMount() {
		document.addEventListener('click', this.handleClickOutside, true);
	}

	handleClickOutside = event => {
		const domNode = ReactDOM.findDOMNode(this);
		if ((!domNode || !domNode.contains(event.target))) {
			this.props.closeSidePanel()
		}
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleClickOutside, true);
	}

	render() {
		let data = this.props.data ? this.props.data.length > 0 ? this.props.data : [] : []
		console.log('data: ', data)
		return (
			<div className='dropdown-coneten'>
				{
					data.map(element => {
						return (
							<div className='css-elapsis each-ten-dropdown'>
								{element.name}
							</div>
						)
					})
				}
			</div>
		)
	}
}
