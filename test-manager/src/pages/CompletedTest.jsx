import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { TopHeader } from "../components/TopHeader";
import axios from "axios";

export const CompletedTest = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const check = sessionStorage.getItem("isLoggedIn");
  const userEmail = sessionStorage.getItem("email");

  useEffect(() => {
    if (!check) {
      navigate("/");
    }
  });

  const getTestComplete = async () => {
    try {
      const res = await axios.get(
        `https://api.ezitech.org/get-test-complete/${userEmail}`
      );
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTestComplete();
  }, [getTestComplete]);

  const [currentPage, settCurrentPage] = useState(1);
  const recordPerPage = 15;
  const lastIndex = currentPage * recordPerPage;
  const firstIndex = lastIndex - recordPerPage;
  const records = data.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(data.length / recordPerPage);
  const numbers = [...Array(nPage + 1).keys()].slice(1);

  function prevPage() {
    if (currentPage !== firstIndex) {
      settCurrentPage(currentPage - 1);
    }
  }

  // function changeCurrentPage(id) {
  //   settCurrentPage(id);
  // }

  function nextPage() {
    if (currentPage !== nPage) {
      settCurrentPage(currentPage + 1);
    }
  }

  const RemoveCompletedIntern = (email) => {
    axios
      .post("https://api.ezitech.org/remove-completed", { email })
      .then((res) => {
        if (res.data.status) {
          alert(res.data.msg);
        } else {
          alert("Something Went Wrong!!!");
        }
      });
  };

  const ActivePortal = (email) => {
    axios
      .post("https://api.ezitech.org/active-portal", { email })
      .then((res) => {
        if (res.data === 1) {
          alert("Portal Activated");
        } else {
          alert("Something Went Wrong!!!");
        }
      });
  };

  return (
    <>
      <div class="wrapper">
        <Sidebar />
        <div class="main">
          <TopHeader />
          <main class="content px-3 py-2">
            <div class="container-fluid">
              <div class="mt-4 mb-5" aria-label="breadcrumb">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item">
                    <a href="#">Dashboard</a>
                  </li>
                  <li class="breadcrumb-item active" aria-current="page">
                    Test
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
                            <h4>Welcome, Manager</h4>
                            <p class="mb-0">Manager Dashboard</p>
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
                  <div class="card-title">Completed Tasks</div>

                  <div class="card-body overflow-x-scroll">
                    <table class="table">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Contact</th>
                          <th scope="col">Technology</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((rs) => {
                          const {
                            id,
                            name,
                            email,
                            phone,
                            technology,
                            interview_type,
                            status,
                          } = rs;

                          return (
                            <>
                              <tr>
                                <th scope="row">{id}</th>
                                <td>{name}</td>
                                <td>{email}</td>
                                <td>{phone}</td>
                                <td>{technology}</td>
                                <td>
                                  <div class="btn-group">
                                    <button
                                      type="button"
                                      class="btn btn-primary dropdown-toggle"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      Action
                                    </button>
                                    <ul class="dropdown-menu">
                                      <li>
                                        <a class="dropdown-item" href="#">
                                          Send Mail
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="#"
                                          type="button"
                                          onClick={() => ActivePortal(email)}
                                        >
                                          Active Portal
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          class="dropdown-item"
                                          href="#"
                                          type="button"
                                          onClick={() =>
                                            RemoveCompletedIntern(email)
                                          }
                                        >
                                          Remove
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </td>
                              </tr>
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                    {/* Pagination */}
                    <div>
                      {/* <nav> */}
                      <ul className="pagination">
                        <li className="page-item">
                          <a href="#" className="page-link" onClick={prevPage}>
                            Prev
                          </a>
                        </li>
                        {/* {numbers.map((n, i) => (
                            <li
                              className={`page-item ${
                                currentPage === n ? "active" : "   "
                              }`}
                              key={i}
                            >
                              <a
                                href="#"
                                className="page-link"
                                onClick={changeCurrentPage}
                              >
                                {n}
                              </a>
                            </li>
                          ))} */}
                        <li className="page-item">
                          <a href="#" className="page-link" onClick={nextPage}>
                            Next
                          </a>
                        </li>
                      </ul>
                      {/* </nav> */}
                    </div>
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
