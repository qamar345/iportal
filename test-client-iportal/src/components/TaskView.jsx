import axios from "axios";
import React, { useEffect, useState } from "react";

export const TaskView = ({ data }) => {
  const [details, setDetails] = useState([]);

  const GetTaskDetails = async () => {
    await axios
      .get(`https://api.ezitech.org/task-details/${data.taskId}`)
      .then((res) => {
        setDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    GetTaskDetails();
  }, [data]);
  return (
    <>
      {/* <!-- Modal --> */}
      <div
        className="modal fade text-left"
        id="large"
        tabindex="-1"
        role="dialog"
        aria-labelledby="myModalLabel17"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="myModalLabel17">
                Task Details
              </h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {Array.isArray(details)
                ? details.map((rs) => (
                    <>
                      <h4>Title: {rs.task_title}</h4>
                      <hr />
                      <div
                        style={{ lineHeight: "5px", fontFamily: "sans-serif" }}
                        dangerouslySetInnerHTML={{
                          __html: rs.task_description,
                        }}
                      ></div>
                    </>
                  ))
                : ""}
            </div>
            {/* <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
              >
                Accept
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};