import React from 'react';
import Color from 'color';
import classNames from 'classnames';
import moment from 'moment';

class Years extends React.Component {

  handleButtonPress = (year) => {
    this.cleared = false;
    this.buttonPressTimer = setTimeout(() => {
      const isSelected = this.props.value.indexOf(year) >= 0;
      if (!isSelected) {
        this.props.onChange([ ...this.props.value, year ].sort());
      } else if (this.props.value.length > 1) {
        this.props.onChange(this.props.value.filter(value => value !== year));
      }
      this.cleared = true;
    }, 300);
  }

  handleButtonRelease = (year, ctrlKey) => {
    if (!this.cleared && !ctrlKey) {
      this.props.onChange([ year ]);
    }
    clearTimeout(this.buttonPressTimer);
    this.cleared = true;
  }

  render() {
    const color = Color({ r: 255, g: 127, b: 127 });
    const time = moment(this.props.min);
    const allYears = [];
    while (time <= this.props.max) {
      allYears.unshift(time.format('YYYY'));
      time.add(1, 'year');
    }
    const years = allYears.map((year, index) => {
      const isSelected = this.props.value.indexOf(year) >= 0;
      return (
        <li 
          key={year}
          className="p-1 d-inline-block"
        >
          <button 
            className={classNames('btn btn-outline-dark', {
              active: isSelected
            })}
            onTouchStart={() => this.handleButtonPress(year)} 
            onTouchEnd={(e) => this.handleButtonRelease(year, e.ctrlKey)} 
            onMouseDown={() => this.handleButtonPress(year)} 
            onMouseUp={(e) => this.handleButtonRelease(year, e.ctrlKey)} 
            onClick={(e) => {
              if (!isSelected && e.ctrlKey) {
                this.props.onChange([ ...this.props.value, year ].sort());
              } else if (e.ctrlKey && this.props.value.length > 1) {
                this.props.onChange(this.props.value.filter(value => value !== year));
              }
            }}
          >
            {year}
            {isSelected &&
              <span 
                className="ml-1 px-2" 
                style={{
                  backgroundColor: color.rotate(this.props.value.indexOf(year) / this.props.value.length * 360).rgb().string()
                }}
              />
            }
          </button>      
        </li>
      )
    })
    return (
      <>
        <ul className="list-unstyled m-n1 d-flex justify-content-center flex-wrap">
          {years}
        </ul>
        <div className="text-right">
          <small>Hold down to select multiple years</small>
        </div>
      </>
    );
  }
}

export default Years;
