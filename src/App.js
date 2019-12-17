import React from 'react';
import moment from 'moment';
import Papa from 'papaparse';
import Chart from './Chart';
import Years from './Years';
import Stats from './Stats';

export default class App extends React.Component {

  state = {
    years: [ moment().format('YYYY') ],
    data: false
  }

  componentDidMount() {
    Papa.parse(`https://docs.google.com/spreadsheets/d/${process.env.REACT_APP_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Sheet1`, {
      download: true,
      complete: (results) => {
        const data = {
          average: {
            months: Array(12).fill(0),
            year: { 
              total: 0,
              records: 0,
              days: 0
            }
          }
        }
        const start = moment('2001-01-01');
        const time = moment(start);
        while (time < moment()) {
          const year = time.format('YYYY');
          data[year] = {
            label: year,
            months: Array(12).fill(0),
            stats: {
              total: 0,
              records: 0,
              days: 0
            }
          };
          time.add(1, 'year');
        }
        results['data'].shift();
        results['data'].forEach((day) => {
          const amount = parseFloat(day[1]);
          const date = moment(day[0], 'DD/MM/YYYY');
          const year = date.format('YYYY');
          const month = parseInt(date.format('M')) - 1;
          if (!isNaN(amount)) {
            data['average']['months'][month] += amount;
            data['average']['year']['total'] += amount;
            data[year]['months'][month] += amount;
            data[year]['stats']['total'] += amount;
            data[year]['stats']['records'] += 1;
            data['average']['year']['records'] += 1;
            data[year]['stats']['days'] += 1;
            data['average']['year']['days'] += 1;
            const extra = parseInt(day[2]);
            if (!isNaN(extra)) {
              data[year]['stats']['days'] += extra;
              data['average']['year']['days'] += extra;
            }
          }
        });
        data['average']['months'].forEach((month, index) => {
          const count = moment().diff(moment(start).month(index), 'years');
          data['average']['months'][index] /= count;
        });
        const count = moment().diff(start, 'years', true);
        data['average']['year']['total'] /= count;
        data['average']['year']['records'] /= count;
        data['average']['year']['days'] /= count;
        this.setState({ data });
      }
    });
  }

  render() {
    if (!this.state.data) {
      return (<div>Loading...</div>);
    }
    return (
      <div className="container">
        <h1 className="text-center">Rainfall</h1>
        <hr className="my-4"/>
        <Years
          onChange={years => this.setState({ years })}
          value={this.state.years}
        />
        <hr className="my-4"/>
        <Chart
          years={this.state.years.map(year => this.state.data[year])}
          average={this.state.data.average}
        />
        <hr className="my-4"/>
        <Stats
          years={this.state.years.map(year => this.state.data[year])}
          average={this.state.data.average}
        />
      </div>
    );
  }

}
