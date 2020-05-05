import React from "react";
import { connect } from "react-redux";

const RoomSelect = ({ rooms, onSelect }) => {
  return (
    <div className="form-group">
      <label htmlFor="sel1">سالن سمینار</label>
      <select
        onChange={onSelect}
        className="form-control"
        name="room"
        id="sel1"
      >
        <option value={0}>اتاق جلسات مورد نظر را انتخاب نمایید</option>
        {rooms.map((room) => {
          return (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    rooms: state.rooms,
  };
}

export default connect(mapStateToProps)(RoomSelect);
