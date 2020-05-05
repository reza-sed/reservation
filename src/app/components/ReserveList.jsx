import React from "react";
import { connect } from "react-redux";

const ReserveList = ({ name, reservations }) => {
  return (
    <div>
      <h2>{name}</h2>
      <div>
        {reservations.map((r) => (
          <div key={r.id}>
            <h3>{r.sectionName}</h3>
            <div>{r.reserveFromDate.toString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

function mapStateToProps(state, ownProps) {
  let roomId = ownProps.room.id;
  return {
    name: ownProps.room.name,
    id: roomId,
    reservations: state.reservations.filter((r) => r.roomId == roomId),
  };
}

export default connect(mapStateToProps)(ReserveList);
