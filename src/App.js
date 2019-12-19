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
        const data = {};
        const averages = {
          months: Array(12).fill(0),
          year: { 
            total: 0,
            records: 0,
            days: 0
          }
        };
        results.data.shift();
        const readings = results.data
          .filter(reading => !isNaN(parseFloat(reading[1])))
          .map(reading => ({
            date: moment(reading[0], 'DD/MM/YYYY'),
            amount: parseFloat(reading[1]),
            extraDays: isNaN(parseInt(reading[2])) ? 0 : parseInt(reading[2]),
          }))
          .sort((a, b) => Math.sign(a.date - b.date));
        const dates = readings.map(reading => reading.date);
        const start = moment(moment.min(dates)).startOf('year');
        const end = moment(moment.max(dates)).endOf('year');        
        const time = moment(start);
        while (time <= end) {
          const year = time.format('YYYY');
          data[year] = {
            label: year,
            months: Array(12).fill(0),
            stats: {
              total: 0,
              records: 0,
              days: 0,
            }
          };
          time.add(1, 'year');
        }
        readings.forEach((reading) => {
          const year = reading.date.format('YYYY');
          const month = parseInt(reading.date.format('M')) - 1;
          averages['months'][month] += reading.amount;
          averages['year']['total'] += reading.amount;
          data[year]['months'][month] += reading.amount;
          data[year]['stats']['total'] += reading.amount;
          data[year]['stats']['records'] += 1;
          averages['year']['records'] += 1;
          data[year]['stats']['days'] += 1;
          averages['year']['days'] += 1;
          data[year]['stats']['days'] += reading.extraDays;
          averages['year']['days'] += reading.extraDays;
        });
        averages['months'].forEach((month, index) => {
          const count = moment().diff(moment(start).month(index), 'years');
          averages['months'][index] /= count;
        });
        const count = moment().diff(start, 'years', true);
        averages['year']['total'] /= count;
        averages['year']['records'] /= count;
        averages['year']['days'] /= count;
        this.setState({ data, start, end, readings, averages });
      }
    });
  }

  render() {
    if (!this.state.data) {
      return (<div>Loading...</div>);
    }
    return (
      <div className="container">
        <h1 className="text-center">Wongaling Beach Rainfall</h1>
        <hr className="my-4"/>
        <Years
          onChange={years => this.setState({ years })}
          value={this.state.years}
          min={this.state.start}
          max={this.state.end}
        />
        <hr className="my-4"/>
        <Chart
          years={this.state.years.map(year => this.state.data[year])}
          average={this.state.averages}
        />
        <hr className="my-4"/>
        <Stats
          years={this.state.years.map(year => this.state.data[year])}
          average={this.state.averages}
          latest={this.state.readings[this.state.readings.length - 1]}
          highestDay={this.state.readings.filter(r => r.extraDays === 0).reduce((p, c) => p.amount > c.amount ? p : c)}
          highestYear={Object.values(this.state.data).reduce((p, c) => p.stats.total > c.stats.total ? p : c)}
        />
      </div>
    );
  }

}
