import React, { FormEvent, useState } from "react";
import { inputHelper } from "../../../helper";
import { apiResponse, userModel } from "../../../interfaces";
import { useLoginUserMutation } from "../../../apis/auth-api";
import jwtDecode from "jwt-decode";
import { useDispatch } from "react-redux";
import { setLoggedInUser } from "../../../storage/redux/userAuth-slice";

const Login = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loginUser] = useLoginUserMutation();
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    userName: "",
    password: ""
  });

  const handleInputUser = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const tempData = inputHelper(event, userInput);
    setUserInput(tempData);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const response: apiResponse = await loginUser({
      userName: userInput.userName,
      password: userInput.password
    });

    if (response.data) {
      console.log(response.data);
      const {token} = response.data.result;
      const {fullName, id, email, role} : userModel = jwtDecode(token);
      localStorage.setItem("token", token);
      dispatch(setLoggedInUser({fullName, id, email, role}));
    } else if (response.error) {
      console.log(response.error.data.errorMessages[0]);
      setError(response.error.data.errorMessages[0]);
    }
    setLoading(false);
  };

  return (
    <div className="container text-center">
      <form method="post" onSubmit={handleSubmit}>
        <h1 className="mt-5">Login</h1>
        <div className="mt-5">
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Username"
              required
              name="userName"
              value={userInput.userName}
              onChange={handleInputUser}
            />
          </div>

          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              required
              name="password"
              value={userInput.password}
              onChange={handleInputUser}
            />
          </div>
        </div>

        <div className="mt-2">
          {error && <p className="text-danger">{error}</p>}
          <button
            type="submit"
            className="btn btn-success"
            style={{ width: "200px" }}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

