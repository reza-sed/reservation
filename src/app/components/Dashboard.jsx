import React from "react";
import { connect } from "react-redux";
import ReserveList from "./ReserveList";

export const Dashboard = ({ rooms }) => {
  return (
    <div>
      <h1>لیست درخواست ها</h1>

      <div>
        {rooms.map((room) => (
          <ReserveList key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    rooms: state.rooms,
  };
}
export default connect(mapStateToProps)(Dashboard);
