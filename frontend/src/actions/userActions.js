import Axios from "axios";
import Cookie from "js-cookie";
import {
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNIN_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LOGOUT,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
} from "../constants/userConstants";

const update = ({ userId, name, email, password }) => async (
  dispatch,
  getState
) => {
  const {
    userSignin: { userInfo },
  } = getState();
  dispatch({
    type: USER_UPDATE_REQUEST,
    payload: { userId, name, email, password },
  });
  try {
    if (password.length < 8) {
      dispatch({
        type: USER_UPDATE_FAIL,
        payload: "Password should contain at least 8 characters.",
      });
    } else {
      const { data } = await Axios.put(
        "/api/users/" + userId,
        { name, email, password },
        {
          headers: {
            Authorization: "Bearer " + userInfo.token,
          },
        }
      );
      dispatch({
        type: USER_UPDATE_SUCCESS,
        payload: "Profile Updated Successfully",
      });
      alert("Profile Updated Successfully");
      Cookie.set("userInfo", JSON.stringify(data));
    }
  } catch (error) {
    dispatch({ type: USER_UPDATE_FAIL, payload: "Could Not Update Profile" });
  }
};

const signin = (email, password) => async (dispatch) => {
  if (password.length < 8) {
    dispatch({
      type: USER_SIGNIN_FAIL,
      payload: "Password requires at least 8 characters",
    });
  } else {
    dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } });
    try {
      const { data } = await Axios.post("/api/users/signin", {
        email,
        password,
      });
      dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
      Cookie.set("userInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: USER_SIGNIN_FAIL,
        payload: "Invalid Email or Password",
      });
    }
  }
};

const register = (name, email, password, rePassword) => async (dispatch) => {
  if (password !== rePassword) {
    dispatch({ type: USER_REGISTER_FAIL, payload: "Passwords do not match." });
  } else if (password.length < 8) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: "Password should contain at least 8 characters.",
    });
  } else {
    dispatch({
      type: USER_REGISTER_REQUEST,
      payload: { name, email, password },
    });
    try {
      const { data } = await Axios.post("/api/users/register", {
        name,
        email,
        password,
      });
      dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
      Cookie.set("userInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload: "Email already registered.",
      });
    }
  }
};

const logout = () => (dispatch) => {
  Cookie.remove("userInfo");
  dispatch({ type: USER_LOGOUT });
};
export { signin, register, logout, update };
