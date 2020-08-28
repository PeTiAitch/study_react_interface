import React, { Component } from 'react';
import '../css/App.css';
import AddAppointments from './AddAppointments';
import ListAppointments from './ListAppointments';
import SearchAppointments from './SearchAppointments';
import {without} from 'lodash';

class App extends Component {
    constructor() {
        super();

        this.state = {
            myAppointments: [],
            formDisplay: false,
            lastIndex: 0,
        }
    }

    componentDidMount() {
        fetch('./data.json')
        .then(response => response.json())
        .then(result => {
            const apts = result.map(apt => {
                this.setState({ lastIndex: this.state.lastIndex + 1 });
                apt.id = this.state.lastIndex;
                return apt;
            });
            this.setState({myAppointments: apts});
        });
    }

    deleteAppointment = (appointment) => {
        let tempAppointments = this.state.myAppointments;
        tempAppointments = without(tempAppointments, appointment);
        this.setState({
            myAppointments: tempAppointments
        })
    }

    toggleForm = () => {
        this.setState({formDisplay: !this.state.formDisplay});
    }

    render() {
        return (
            <main className="page bg-white" id="petratings">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 bg-white">
                            <div className="container">
                                <AddAppointments 
                                    formDisplay={this.state.formDisplay} 
                                    toggleForm={this.toggleForm}
                                    />
                                <SearchAppointments />
                                <ListAppointments 
                                appointments={this.state.myAppointments}
                                deleteAppointment={this.deleteAppointment} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

export default App;
