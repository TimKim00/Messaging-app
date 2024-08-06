import PropTypes from "prop-types";
import DefaultProfile from "../../assets/defaultProfile.png";

export default function RoomImage({ users, borderColor = "border-white" }) {
  let profileComponent = <></>;

  if (users.length === 1) {
    profileComponent = (
      <img
        src={users[0].coverImage || DefaultProfile}
        alt=""
        className={`w-11 h-11 rounded-[16px] ${borderColor}`}
      />
    );
  } else if (users.length === 2) {
    profileComponent = (
      <div className="relative w-11 h-11">
        <img
          src={users[1].coverImage || DefaultProfile}
          alt=""
          className={`absolute z-0 right-0 bottom-0 w-7 h-7 rounded-[10px] ${borderColor}`}
        />
        <img
          src={users[0].coverImage || DefaultProfile}
          alt=""
          className={`absolute z-0 -left-1 -top-1 w-7 h-7 rounded-[10px] box-content border-2 ${borderColor}`}
        />
      </div>
    );
  } else if (users.length === 3) {
    profileComponent = (
      <div className="relative w-11 h-11">
        <img
          src={users[1].coverImage || DefaultProfile}
          alt=""
          className={`absolute bottom-0 -left-1 w-6 h-6 rounded-[9px] box-content border-2 ${borderColor}`}
        />
        <img
          src={users[2].coverImage || DefaultProfile}
          alt=""
          className={`absolute bottom-0 -right-1 w-6 h-6 rounded-[9px] box-content border-2 ${borderColor}`}
        />
        <img
          src={users[0].coverImage || DefaultProfile}
          alt=""
          className={`absolute -top-1 left-2 w-6 h-6 rounded-[9px] box-content border-2 ${borderColor}`}
        />
      </div>
    );
  } else if (users.length >= 4) {
    profileComponent = (
      <div className="relative w-11 h-11">
        <img
          src={users[0].coverImage || DefaultProfile}
          alt=""
          className={`absolute top-0 w-5 h-5 rounded-[7px] ${borderColor}`}
        />
        <img
          src={users[1].coverImage || DefaultProfile}
          alt=""
          className={`absolute top-0 right-0 w-5 h-5 rounded-[7px] ${borderColor}`}
        />
        <img
          src={users[2].coverImage || DefaultProfile}
          alt=""
          className={`absolute bottom-0 left-0 w-5 h-5 rounded-[7px] ${borderColor}`}
        />
        <img
          src={users[3].coverImage || DefaultProfile}
          alt=""
          className={`absolute bottom-0 right-0 w-5 h-5 rounded-[7px] ${borderColor}`}
        />
      </div>
    );
  }

  return profileComponent;
}

RoomImage.propTypes = {
  users: PropTypes.array.isRequired,
  borderColor: PropTypes.string,
};
