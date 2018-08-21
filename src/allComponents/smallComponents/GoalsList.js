import React, { Component } from 'react'

//thunk imports
import { connect } from 'react-redux'
import { getAllGoal } from '../../Store/GoalReducer'
import { destroyingGoal } from '../../Store/GoalReducer'


class GoalsList extends Component {
    constructor() {
        super()
    }
    componentDidMount() {
        this.props.getAllGoal()
    }
    deleteGoalHandler = (goalId) => {
        this.props.deleteGoals(goalId)
        this.forceUpdate()
    }
    paidHandler = () => {
        console.log('paid button is clicked')
    }
    editHandler = () => {
        
    }
    render() {
        console.log(this.props.goals)
        const goals = this.props.goals.allGoals
        return (
            <div className="panel panel-default">
                <div className="panel-heading main-color-bg">
                    <h3 className="panel-title">Goals</h3>
                </div>
                <div className="panel-body">
                    <div className="row">
                        {/* <div className="col-md-12">
                <input className="form-control" type="text" placeholder="Filter Posts..." />
            </div> */}
                    </div>
                    <br />
                    <table className="table table-striped table-hover">
                        {goals.length ?
                            (<tbody >
                                <tr>
                                    <th>Goal</th>
                                    <th>How Much?</th>
                                    <th>Monthly Savings</th>
                                    <th>Created</th>
                                    <th>End Date</th>
                                    <th></th>
                                </tr>
                                {
                                    goals.map((goal, index) => {
                                        console.log('GOAl', index)
                                        return (
                                            <tr key={index}>
                                                <td>{goal.goalTitle}</td>
                                                <td>{goal.howMuch}</td>
                                                <td>$30</td>
                                                <td>{goal.Created}</td>
                                                <td>{goal.selectedDay}</td>
                                                <td><a className="btn main-color-bg" onClick={this.paidHandler}>Paid</a><a className="btn btn-default" href={`#/editgoal/${index}`}>Edit</a> <a className="btn btn-danger" onClick={() => this.deleteGoalHandler(index)}>Delete</a></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>)
                            :

                            (<tbody >
                                <tr>
                                    <th>Goal</th>
                                    <th>How Much?</th>
                                    <th>Monthly Savings</th>
                                    <th>Created</th>
                                    <th>End Date</th>
                                    <th></th>
                                </tr>
                            </tbody>)}


                    </table>
                </div>
            </div>

        )
    }
}

const MapStateToProps = state => {
    return {
        goals: state.goals
    }
}

const MapDispatchToProps = dispatch => {
    return {
        getAllGoal: () => dispatch(getAllGoal()),
        deleteGoals: goal => dispatch(destroyingGoal(goal))
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(GoalsList)