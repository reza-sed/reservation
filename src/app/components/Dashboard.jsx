import React from "react";
import { connect } from "react-redux";
import ReserveList from "./ReserveList";

export const Dashboard = ({ rooms }) => {
  return (
    <div>
      <h4>لیست درخواست ها</h4>
      {rooms.map((room) => (
        <ReserveList key={room.id} room={room} />
      ))}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    rooms: state.rooms,
  };
}
export default connect(mapStateToProps)(Dashboard);
