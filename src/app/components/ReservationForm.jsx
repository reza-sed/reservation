import React, { Component } from "react";
import { connect } from "react-redux";
import { requestReservation } from "./../store/actions/reserveAction";
import RoomSelect from "./RoomSelect";
import { DateTimeRangePicker } from "react-advance-jalaali-datepicker";
import { shamsiFromISoDate } from "./../utils/dateUtils";
import { checkReservationDate } from "../service/reservationService";
import { toast } from "react-toastify";
import Joi from "@hapi/joi";
import produce from "immer";

class ReservationForm extends Component {
  state = {
    activeReservedList: [],
    data: {
      room: "",
      startDateTime: "",
      endDateTime: "",
      section: "",
      desc: "",
    },
    errors: {},
  };

  schema = Joi.object({
    room: Joi.number().required().messages({
      "any.required": "انتخاب سالن سمینار الزامی است",
      "number.base": "انتخاب سالن سمینار الزامی است",
    }),
    section: Joi.string().required().messages({
      "any.required": "انتخاب قسمت کاری محوله الزامی است",
      "string.empty": "انتخاب قسمت کاری محوله الزامی است",
    }),
    startDateTime: Joi.number().required().messages({
      "any.required": "انتخاب تاریخ ابتدا الزامی است",
      "number.base": "انتخاب تاریخ ابتدا الزامی است",
    }),
    endDateTime: Joi.number().required().messages({
      "any.required": "انتخاب تاریخ انتها الزامی است",
      "number.base": "انتخاب تاریخ انتها الزامی است",
    }),
    desc: Joi.string().allow(""),
  }).unknown(true);

  validateProperty = (name, value) => {
    const obj = { [name]: value };
    return this.schema.validate(obj, {
      allowUnknown: true,
      abortEarly: false,
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;

    //const { error } = this.validateProperty(name, value);

    const newState = produce(this.state, (draftState) => {
      // if (error) {
      //   draftState.errors[name] = error.details[0].message;
      // } else {
      //   delete draftState.errors[name];
      draftState.data[name] = value;
      // }
    });

    this.setState(newState);
  };

  validate = () => {
    const { error } = this.schema.validate(this.state.data, {
      abortEarly: false,
    });
    if (!error) return true;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    this.setState({ errors });
  };

  submit = (e) => {
    e.preventDefault();
    const { room, startDateTime, endDateTime, desc, section } = this.state.data;

    this.validate() &&
      this.props.newReserve(room, section, desc, startDateTime, endDateTime);
  };

  componentDidUpdate(_prevProps, prevState) {
    if (
      this.state.data.startDateTime &&
      this.state.data.room &&
      (prevState.data.startDateTime !== this.state.data.startDateTime ||
        prevState.data.room !== this.state.data.room)
    ) {
      checkReservationDate(this.state.data.startDateTime, this.state.data.room)
        .then((res) => {
          this.setState({ activeReservedList: res });
        })
        .catch((e) => {
          toast.error(e);
        });
    }
  }

  render() {
    let { errors } = this.state;
    return (
      <div>
        <div className="row">
          <div className="col-6">
            {Object.keys(errors).length !== 0 && (
              <div className="alert alert-danger">
                <ul>
                  {Object.keys(errors).map((prop) => (
                    <li key={prop}>{errors[prop]}</li>
                  ))}
                </ul>
              </div>
            )}
            <h4>رزرو سالن سمینار</h4>
            <form onSubmit={this.submit}>
              <RoomSelect onSelect={this.handleChange} />
              <div className="form-group">
                <DateTimeRangePicker
                  placeholderStart="تاریخ و ساعت شروع"
                  placeholderEnd="تاریخ و ساعت پایان"
                  format="jYYYY/jMM/jDD HH:mm"
                  onChangeStart={(unix) => {
                    this.handleChange({
                      target: { name: "startDateTime", value: unix },
                    });
                  }}
                  onChangeEnd={(unix) => {
                    this.handleChange({
                      target: { name: "endDateTime", value: unix },
                    });
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
              <input className="btn btn-primary" type="submit" value="ثبت" />
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
    newReserve(room, section, desc, startDateTime, endDateTime) {
      dispatch(
        requestReservation(room, section, desc, startDateTime, endDateTime),
      );
    },
  };
};

export default connect((state) => state, mapDispatchToProps)(ReservationForm);
