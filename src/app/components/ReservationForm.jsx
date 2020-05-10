import React, { Component } from "react";
import { connect } from "react-redux";
import { requestReservation } from "./../store/actions/reserveAction";
import RoomSelect from "./RoomSelect";
import { DateTimeRangePicker } from "react-advance-jalaali-datepicker";
import { getActiveReservedDates } from "../../utils/reservationUtils";
import { shamsiFromISoDate } from "../../utils/dateUtils";

class ReservationForm extends Component {
  state = {};

  handleChange = (e) => {
    let newState = { ...this.state };
    const { name, value } = e.target;
    newState[name] = value;

    this.setState(newState);
  };

  componentDidUpdate(_prevProps, prevState) {
    if (
      this.state.startDateTime &&
      this.state.room &&
      (prevState.startDateTime !== this.state.startDateTime ||
        prevState.room !== this.state.room)
    ) {
      getActiveReservedDates(this.state.startDateTime, this.state.room)
        .then((res) => {
          this.setState({ activeReservedList: res });
        })
        .catch((e) => {
          // alert("عدم امکان ارتباط با سرور");
          console.log(e);
        });
    }
  }

  render() {
    let { newReserve } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-6">
            <h4>رزرو سالن سمینار</h4>
            <form onSubmit={(e) => newReserve(e, this.state)}>
              <RoomSelect onSelect={this.handleChange} />
              <div className="form-group">
                <DateTimeRangePicker
                  placeholderStart="تاریخ و ساعت شروع"
                  placeholderEnd="تاریخ و ساعت پایان"
                  format="jYYYY/jMM/jDD HH:mm"
                  onChangeStart={(unix) => {
                    this.setState({ startDateTime: unix });
                  }}
                  onChangeEnd={(unix) => {
                    this.setState({ endDateTime: unix });
                  }}
                  idStart="rangePickerStart"
                  idEnd="rangePickerEnd"
                />
              </div>
              <div className="form-group">
                <label htmlFor="sectionName">واحد</label>
                <input
                  type="text"
                  className="form-control"
                  id="sectionName"
                  name="section"
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="descArea">توضیحات</label>
                <textarea
                  className="form-control"
                  id="descArea"
                  rows="2"
                  name="desc"
                  onChange={this.handleChange}
                ></textarea>
              </div>
              <input type="submit" value="ثبت" />
            </form>
          </div>
          <div className="col-6">
            <h4>لیست رزرو شده های روز</h4>
            {this.state.activeReservedList &&
              this.state.activeReservedList.map((r) => (
                <div className="card border-primary mb-3" key={r.id}>
                  <div className="card-body">
                    <h5 className="card-title">{r.sectionName}</h5>
                    <div className="row">
                      <div className="col-6">
                        <span>{shamsiFromISoDate(r.reserveFromDate)}</span>
                      </div>
                      <div className="col-6">
                        <span>{shamsiFromISoDate(r.reserveToDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    newReserve(e, localState) {
      e.preventDefault();
      const { room, startDateTime, endDateTime, desc, section } = localState;
      dispatch(
        requestReservation(room, section, desc, startDateTime, endDateTime)
      );
    },
  };
};

export default connect((state) => state, mapDispatchToProps)(ReservationForm);
