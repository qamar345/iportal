import React, { useEffect, useState } from "react";
import { AdminSidebar } from "../../components/AdminSidebar";
import { TopHeader } from "../../components/TopHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Transactions = () => {
  const navigate = useNavigate();
  const check = sessionStorage.getItem("isAdminLoggedIn");

  useEffect(() => {
    if (!check) {
      navigate("/");
    }
  });

  const localDate = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [data, setData] = useState([]);
  const [month, setMonth] = useState({
    month: new Date().getMonth() + 1,
  });

  const handleMonth = (e) => {
    setMonth({ ...month, [e.target.name]: e.target.value });
  };

  const GetTransactions = async () => {
    try {
      const res = await axios.get(
        `https://api.ezitech.org/get-transactions/${month.month}`
      );
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetTransactions();
  }, [GetTransactions]);

  return (
    <>
      <div class="wrapper">
        <AdminSidebar />
        <div class="main">
          <TopHeader role={"Admin"} />

          <main class="content px-3 py-2">
            <div class="container-fluid">
              <div
                class="mt-4 mb-5"
                // style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E&#34;);"
                aria-label="breadcrumb"
              >
                <ol class="breadcrumb">
                  <li class="breadcrumb-item">
                    <a href="#">Dashboard</a>
                  </li>
                  <li class="breadcrumb-item active" aria-current="page">
                    Transactions
                  </li>
                </ol>
              </div>
              <div class="row">
                <div class="col-12 d-flex">
                  <div class="card flex-fill border-0 illustration shadow">
                    <div class="card-body p-0 d-flex flex-fill">
                      <div class="row g-0 w-100">
                        <div class="col-6">
                          <div class="p-3 m-1">
                            <h4>Welcome, Admin</h4>
                            <p class="mb-0">Admin Dashboard</p>
                            <br />
                            <div class="card-title">
                              <h4>
                                Latest Updates of {months[localDate.getMonth()]}
                              </h4>
                            </div>
                          </div>
                        </div>
                        <div class="col-6 align-self-end text-end">
                          <img
                            src="assets/images/customer-support.jpg"
                            class="img-fluid illustration-img"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card border-0 shadow">
                <div class="card-header">
                  <div className="row">
                    <div className="col-sm-6">
                      <div class="card-title">Transactions</div>
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="">Select Month: </label>
                      &nbsp;
                      <select
                        style={{ width: "100px" }}
                        name="month"
                        id=""
                        onChange={handleMonth}
                      >
                        <option value={month.month} disabled>
                          {month.month}
                        </option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                      </select>
                    </div>
                  </div>

                  <div class="card-body overflow-x-scroll">
                    <table class="table text-center">
                      <thead>
                        <tr>
                          <th scope="col">Amount</th>
                          <th scope="col">Instructor-Email</th>
                          <th scope="col">Manager-Email</th>
                          <th scope="col">Company-Amount</th>
                          <th scope="col">Instructor-Amount</th>
                          <th scope="col">Manager-Amount</th>
                          {/* <th scope="col">Remaining-Amount</th> */}
                          <th scope="col">Date</th>
                          {/* <th scope="col">Action</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(data)
                          ? data.map((rs) => {
                              const {
                                amount,
                                instructor_email,
                                manager_email,
                                company_amount,

                                instructor_amout,
                                manager_amount,
                                remaining_amount,
                                created_at,
                              } = rs;

                              return (
                                <>
                                  <tr>
                                    <td>{amount}</td>
                                    <td>{instructor_email}</td>
                                    <td>{manager_email}</td>
                                    <td>{company_amount}</td>
                                    <td>{instructor_amout}</td>
                                    <td>{manager_amount}</td>
                                    {/* <td>{remaining_amount}</td> */}
                                    <td>{created_at.slice(0, 10)}</td>
                                  </tr>
                                </>
                              );
                            })
                          : " "}
                      </tbody>
                    </table>
                    {/* Pagination */}
                  </div>
                </div>
              </div>
            </div>
          </main>

          <footer class="footer border-top">
            <div class="container-fluid">
              <div class="row text-muted">
                <div class="col-6 text-start p-3">
                  <p class="mb-0">
                    <a href="" class="text-muted">
                      <strong>Manager Dashboard</strong>
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};