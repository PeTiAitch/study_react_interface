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
            orderBy: 'petName',
            orderDir: 'asc',
            queryText: ''
        }
    }

    componentDidMount() {
        fetch('./data.json')
        .then(response => response.json())
        .then(result => {
            const apts = result.map(apt => {
                apt.id = this.state.lastIndex;
                this.setState({ lastIndex: this.state.lastIndex + 1 });
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
    };

    toggleForm = () => {
        this.setState({formDisplay: !this.state.formDisplay});
    };

    addAppointment = (apt) => {
        let tempApts = this.state.myAppointments;
        apt.id = this.state.lastIndex;
        tempApts.unshift(apt);
        this.setState({
            myAppointments: tempApts,
            lastIndex: this.state.lastIndex + 1
        });
    };

    changeOrder = (order, dir) => {
        this.setState({
            orderBy: order,
            orderDir: dir
        });
    };

    render() {
        let order, filteredApts = this.state.myAppointments;

        filteredApts = filteredApts.filter(apt => {
            return (
                apt.petName.toLowerCase().includes(this.state.queryText.toLocaleLowerCase()) ||
                apt.ownerName.toLowerCase().includes(this.state.queryText.toLocaleLowerCase()) ||
                apt.aptNotes.toLowerCase().includes(this.state.queryText.toLocaleLowerCase())
            )
        })

        order = this.state.orderDir === 'asc' ? 1 : -1;
        filteredApts.sort((a, b) => {
            // Mine, works the same as the one below
            const result = a[this.state.orderBy].localeCompare(b[this.state.orderBy]);
            return result * order;

            // if (a[this.state.orderBy].toLowerCase() < 
            //     b[this.state.orderBy].toLowerCase()
            // ) {
            //     return -1 * order;
            // } else {
            //     return 1 * order;
            // }
        });

        return (
            <main className="page bg-white" id="petratings">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 bg-white">
                            <div className="container">
                                <AddAppointments 
                                    formDisplay={this.state.formDisplay} 
                                    toggleForm={this.toggleForm}
                                    addAppointment={this.addAppointment}
                                    />
                                <SearchAppointments
                                    orderBy={this.state.orderBy} 
                                    orderDir = {this.state.orderDir} 
                                    changeOrder = {this.changeOrder}
                                />
                                <ListAppointments 
                                appointments={filteredApts}
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
