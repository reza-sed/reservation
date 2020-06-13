import React from "react";
import { connect } from "react-redux";
import { shamsiFromISoDate } from "./../utils/dateUtils";
import reservationStatus from "./../../utils/reservationStatus";
import {
  deleteReservation,
  modifyReservationStatus,
} from "../store/actions/reserveAction";

const ReserveList = ({
  reservations,
  session,
  handleDelete,
  handleChangeStatus,
  room,
}) => {
  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="card-header">{room.name}</div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">واحد</th>
                <th scope="col">از زمان</th>
                <th scope="col">تا زمان</th>
                <th scope="col">توضیحات</th>
                <th scope="col">وضعیت</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id}>
                  <td>{r.sectionName}</td>
                  <td>{shamsiFromISoDate(r.reserveFromDate)}</td>
                  <td>{shamsiFromISoDate(r.reserveToDate)}</td>
                  <td>{r.description}</td>
                  {!session.isAdmin && <td>{r.status}</td>}
                  {session.isAdmin && (
                    <td>
                      <select
                        className="form-control form-control-sm"
                        onChange={(e) => handleChangeStatus(e, r.id)}
                        value={r.status}
                      >
                        <option value={reservationStatus.REQUESTED}>
                          درخواست شده
                        </option>
                        <option value={reservationStatus.ACCEPTED}>قبول</option>
                        <option value={reservationStatus.CANCELED}>رد</option>
                      </select>
                    </td>
                  )}
                  {
                    <td>
                      <button
                        type="button"
                        className="btn btn-small btn-danger px-2"
                        onClick={() => handleDelete(r.id)}
                      >
                        حذف
                      </button>
                    </td>
                  }
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state, ownProps) {
  let roomId = ownProps.room.id;
  return {
    id: roomId,
    session: state.session,
    reservations: state.reservations.filter((r) => r.roomId == roomId),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handleDelete(rid) {
      dispatch(deleteReservation(rid));
    },
    handleChangeStatus(e, rid) {
      dispatch(modifyReservationStatus(rid, e.target.value));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReserveList);
