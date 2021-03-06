import React, { Component } from 'react'
import update from 'immutability-helper'
import Card from './Card';
import { DropTarget } from 'react-dnd';

class Container extends Component {

	constructor(props) {
		super(props);
		this.state = { cards: props.list, name : props.text};
	}

	pushCard(card, newId) {
		card.list = newId;
		this.setState(update(this.state, {
			cards: {
				$push: [ card ]
			}
		}));
	}

	removeCard(index) {
		this.setState(update(this.state, {
			cards: {
				$splice: [
					[index, 1]
				]
			}
		}));
	}

	moveCard(dragIndex, hoverIndex) {
		const { cards } = this.state;
		const dragCard = cards[dragIndex];

		this.setState(update(this.state, {
			cards: {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragCard]
				]
			}
		}));
	}

	render() {
		const { cards } = this.state;
		const { canDrop, isOver, connectDropTarget } = this.props;
		const isActive = canDrop && isOver;
		const style = {
			width: "200px",
			height: "100%",
			border: '1px solid black'
		};
		const nameStyle = {
			 fontWeight: 'bold'
		};


		return connectDropTarget(
			<div style={{...style}}>
				<p style={{...nameStyle}}> {this.state.name} </p>
				{cards.map((card, i) => {
					return (
						<Card
							key={card.id}
							index={i}
							listId={card.list}
							card={card}
							removeCard={this.removeCard.bind(this)}
							moveCard={this.moveCard.bind(this)} />
					);
				})}
			</div>
		);
  }
}

const cardTarget = {
	drop(props, monitor, component ) {
		const { id } = props;
		const sourceObj = monitor.getItem();
		if ( id !== sourceObj.listId ) component.pushCard(sourceObj.card, id);
		return {
			listId: id
		};
	}
}

export default DropTarget("CARD", cardTarget, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
	canDrop: monitor.canDrop()
}))(Container);
