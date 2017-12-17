import React, { component } from 'react'
import axios from 'axios'
import Idea from './Idea'
import update from 'immutability-helper'
import IdeaForm from './IdeaForm'
{/* when makign a new component I need to make a new js file, at end
	include export default Component to be able to use it in another component
	Need to think about it like partials in rails
*/}
class IdeasContainer extends React.Component {
	// when extending Component always start with React in front

	constructor(props) {
		super(props)
		this.state = {
			ideas: [],
			editingIdeaId: null,
			notification: ''
		}
	}

	componentDidMount() {
		axios.get('http://localhost:3001/api/v1/ideas.json')
		.then(response => {
			console.log(response);
			this.setState({ideas: response.data})
		})
		.catch(error => console.log(error))
	}

	addNewIdea = () => {
	  axios.post(
	  	'http://localhost:3001/api/v1/ideas',
	    { idea:
	      {
	        title: '',
	        body: ''
	      }
	    }
	  )
	  .then(response => {
	    console.log(response)
	    const ideas = update(this.state.ideas, {
	    	$splice : [[0, 0, response.data]]
	    	// splice inserts new data in the respone.data
	    	// at the index 0
	    })
	    this.setState({
	    	ideas: ideas,
	    	editingIdeaId: response.data.id
	    })
	  })
	  .catch(error => console.log(error))
	}

	updateIdea = (ideas) => {
		const ideaIndex = this.state.ideas.findIndex(x => x.id === idea.id)
		const idea = update(this.state.ideas, {
			[ideaIndex]: { $set: idea }
		})
		this.setState({
			ideas: ideas,
			notification: 'All changes have been saved.'
		})
	}

	resetNotification = () =>{
		this.setState({notification: ''})
	}

	enableEditing = (id) =>{
		this.setState({editingIdeaId: id},
			() => { this.title.focus()})
	}

	deleteIdea = (id) => {
  axios.delete(`http://localhost:3001/api/v1/ideas/${id}`)
  .then(response => {
    const ideaIndex = this.state.ideas.findIndex(x => x.id === id)
    const ideas = update(this.state.ideas, { $splice: [[ideaIndex, 1]]})
    this.setState({ideas: ideas})
  })
  .catch(error => console.log(error))
}

	render() {

		return (
			
			<div className="ideas-div">
				<div>
					<button className="newIdeaButton ideas-div" onClick={this.addNewIdea}>New Idea</button>
					<span className="notification">
						{this.state.notification}
					</span> 
				</div>
				<div>
			{this.state.ideas.map((idea) => {
				if(this.state.editingIdeaId === idea.id){
					return(<IdeaForm idea={idea} key={idea.id} updateIdea={this.updateIdea}
					titleRef= {input => this.title = input}
					resetNotification={this.resetNotification}
					/>)
				} else {
					return(<Idea idea={idea} key={idea.id} onClick={this.enableEditing} onDelete={this.deleteIdea} />)
				}
			})}
				</div>
			</div>
		)
	}
}

export default IdeasContainer