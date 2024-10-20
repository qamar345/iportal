const { connection } = require("../../config/connection");
const cron = require("node-cron");
const moment = require("moment-timezone");

// Update intern_account table when deploy
const GetSupervisorsInterns = (req, res) => {
  const { supid } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const sql_0 =
    "SELECT DISTINCT technologies.technology, supervisor_permissions.internship_type FROM `intern_table` JOIN supervisor_permissions ON supervisor_permissions.internship_type = intern_table.intern_type JOIN technologies ON supervisor_permissions.tech_id = technologies.tech_id WHERE supervisor_permissions.manager_id = ?";
  connection.query(sql_0, [supid], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      const superTech = [];
      const superInternship = [];
      for (let i = 0; i < data.length; i++) {
        superTech.push(data[i].technology);
        superInternship.push(data[i].internship_type);
      }

      let query =
        "SELECT * FROM intern_accounts ia LEFT JOIN intern_table it ON ia.email = it.email WHERE 1 = 1";
      const techFilter = superTech.map((t) => t).join("','");

      if (techFilter.length > 0) {
        query += ` AND technology IN ('${techFilter}')`;
      }

      const iship_type = [...new Set(superInternship.map((i) => i))];

      if (iship_type.length > 0) {
        query += ` AND intern_type IN ('${iship_type.join("','")}')`;
      }

      // Status filter
      const statusFilter = "Active"; // Assume 'status' is a variable holding the desired status value

      if (statusFilter && statusFilter.length > 0) {
        query += ` AND status = '${statusFilter}' ORDER BY id DESC LIMIT ? OFFSET ?`;
      }

      if (superTech.length > 0 && superInternship.length > 0) {
        // console.log(query);

        connection.query(query, [limit, offset], (reject, resolve) => {
          if (reject) {
            console.log(reject);
            return res.json(reject);
          } else {
            let countquery =
              "SELECT COUNT(*) as count FROM intern_table WHERE 1= 1";

            if (techFilter.length > 0) {
              countquery += ` AND technology IN ('${techFilter}')`;
            }

            if (iship_type.length > 0) {
              countquery += ` AND intern_type IN ('${iship_type.join("','")}')`;
            }

            if (statusFilter && statusFilter.length > 0) {
              countquery += ` AND status = '${statusFilter}'`;
            }

            connection.query(countquery, (countError, countResult) => {
              if (countError) {
                return res.json(countError);
              } else {
                const totalData = countResult[0].count;
                const totalPages = Math.ceil(totalData / limit);

                return res.json({
                  data: resolve,
                  meta: {
                    page,
                    limit,
                    totalData,
                    totalPages,
                  },
                });
              }
            });
          }
        });
      } else {
        return res.json("Something Went Wrong!!!");
      }
    }
  });
};

const AssignProject = (req, res) => {
  const {
    etiId,
    projectTitle,
    startDate,
    endDate,
    durationDays,
    points,
    description,
    supId,
  } = req.body.project;
  const sql =
    "INSERT INTO `intern_projects`(`eti_id`, `title`, `start_date`, `end_date`, `duration`, `project_marks`, `description`, `assigned_by`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    etiId,
    projectTitle,
    startDate,
    endDate,
    durationDays,
    points,
    description,
    supId,
  ];
  connection.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    } else {
      return res.send({ msg: "Project Assigned successfully", data: data });
    }
  });
};

const GetAttendance = (req, res) => {
  const { email } = req.params;
  const sql =
    "SELECT COUNT(*) as countAttend FROM `intern_attendance` WHERE `email` = ?";
  connection.query(sql, [email], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    } else {
      return res.json(data[0].countAttend);
    }
  });
};

const CountAllProjects = (req, res) => {
  const { email } = req.params;
  const sql =
    "SELECT COUNT(*) as countAllProject FROM `intern_projects` WHERE `email` = ?";
  connection.query(sql, [email], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    } else {
      return res.json(data[0].countAllProject);
    }
  });
};

const CountCompProjects = (req, res) => {
  const { email } = req.params;
  const sql =
    "SELECT COUNT(*) as countCompProject FROM `intern_projects` WHERE `email` = ? AND pstatus = 'Completed'";
  connection.query(sql, [email], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    } else {
      return res.json(data[0].countCompProject);
    }
  });
};

const CountExpProjects = (req, res) => {
  const { email } = req.params;
  const sql =
    "SELECT COUNT(*) as countExpProject FROM `intern_projects` WHERE `email` = ? AND pstatus = 'Expire'";
  connection.query(sql, [email], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    } else {
      // console.log(data[0].countAttend)
      return res.json(data[0].countExpProject);
    }
  });
};

const GetProjects = (req, res) => {
  const { supid } = req.params;
  const sql =
    "SELECT ip.*, ia.name, ia.email, ia.int_technology FROM `intern_projects` ip JOIN `intern_accounts` ia ON ip.eti_id = ia.eti_id WHERE `assigned_by` = ?";
  connection.query(sql, [supid], (err, data) => {
    if (err) throw err;
    return res.json(data);
  });
};

const GetTasks = (req, res) => {
  const { supid } = req.params;
  const sql =
    "SELECT it.*, ip.*, ia.name, ia.int_technology FROM intern_tasks it JOIN intern_projects ip ON it.project_id = ip.project_id JOIN intern_accounts ia ON it.eti_id = ia.eti_id WHERE ip.assigned_by = ?";
  connection.query(sql, [supid], (err, data) => {
    if (err) throw err;
    return res.json(data);
  });
};

const GetTaskDetails = (req, res) => {
  const { tNo, intId, pId } = req.query;

  const sql =
    "SELECT st.*, it.task_title, ip.title FROM submitted_task st JOIN intern_tasks it ON st.task_no = it.task_no JOIN intern_projects ip ON st.project_id = ip.project_id WHERE st.task_no = ? AND st.project_id = ? AND st.eti_id = ?";
  connection.query(sql, [tNo, pId, intId], (err, data) => {
    if (err) throw err;
    return res.json(data);
  });
};

const GetInterLeaves = (req, res) => {
  const { supid } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const sql_0 =
    "SELECT DISTINCT technologies.technology, supervisor_permissions.internship_type FROM `intern_table` JOIN supervisor_permissions ON supervisor_permissions.internship_type = intern_table.intern_type JOIN technologies ON supervisor_permissions.tech_id = technologies.tech_id WHERE supervisor_permissions.manager_id = ?";
  connection.query(sql_0, [supid], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      const superTech = [];
      const superInternship = [];
      for (let i = 0; i < data.length; i++) {
        superTech.push(data[i].technology);
        superInternship.push(data[i].internship_type);
      }

      let query =
        "SELECT il.*, ia.name, it.technology, it.intern_type FROM intern_leaves il LEFT JOIN intern_accounts ia ON il.eti_id = ia.eti_id LEFT JOIN intern_table it ON ia.email = it.email WHERE 1 = 1";
      const techFilter = superTech.map((t) => t).join("','");

      if (techFilter.length > 0) {
        query += ` AND technology IN ('${techFilter}')`;
      }

      const iship_type = [...new Set(superInternship.map((i) => i))];

      if (iship_type.length > 0) {
        query += ` AND intern_type IN ('${iship_type.join("','")}')`;
      }

      // Status filter
      const statusFilter = "Active"; // Assume 'status' is a variable holding the desired status value

      if (statusFilter && statusFilter.length > 0) {
        query += ` AND status = '${statusFilter}' ORDER BY id DESC LIMIT ? OFFSET ?`;
      }

      if (superTech.length > 0 && superInternship.length > 0) {
        // console.log(query);

        connection.query(query, [limit, offset], (reject, resolve) => {
          if (reject) {
            console.log(reject);
            return res.json(reject);
          } else {
            let countquery =
              "SELECT COUNT(*) as count FROM intern_table WHERE 1= 1";

            if (techFilter.length > 0) {
              countquery += ` AND technology IN ('${techFilter}')`;
            }

            if (iship_type.length > 0) {
              countquery += ` AND intern_type IN ('${iship_type.join("','")}')`;
            }

            if (statusFilter && statusFilter.length > 0) {
              countquery += ` AND status = '${statusFilter}'`;
            }

            connection.query(countquery, (countError, countResult) => {
              if (countError) {
                return res.json(countError);
              } else {
                const totalData = countResult[0].count;
                const totalPages = Math.ceil(totalData / limit);

                return res.json({
                  data: resolve,
                  meta: {
                    page,
                    limit,
                    totalData,
                    totalPages,
                  },
                });
              }
            });
          }
        });
      } else {
        return res.json("Something Went Wrong!!!");
      }
    }
  });
};

const ApproveInternLeave = (req, res) => {
  const { intId } = req.params;

  console.log(intId);

  const sql =
    "UPDATE `intern_leaves` SET `leave_status`= 1 WHERE `leave_id` = ?";
  connection.query(sql, [intId], (err, data) => {
    if (err) throw err;
    return res.json({ msg: "Leave Approved", data: data });
  });
};
const RejectInternLeave = (req, res) => {
  const { intId } = req.params;
  console.log(intId);

  const sql =
    "UPDATE `intern_leaves` SET `leave_status`= 0 WHERE `leave_id` = ?";
  connection.query(sql, [intId], (err, data) => {
    if (err) throw err;
    return res.json({ msg: "Leave Rejected", data: data });
  });
};

const ProjectDayIncrement = (req, res) => {
  const sql1 =
    "SELECT days, duration FROM intern_projects WHERE pstatus = 'Ongoing'";
  connection.query(sql1, (err, data1) => {
    if (err) {
      return res.json(err);
    } else {
      for (let i = 0; i < data1.length; i++) {
        if (data1[i].days < data1[i].duration) {
          const day = data1[i].days + 1;
          const sql2 = `UPDATE intern_projects SET days = ${day} WHERE pstatus = 'Ongoing' `;
          connection.query(sql2, (err, data2) => {
            if (err) {
              console.log(err);
            } else {
              console.log(data2);
            }
          });
        } else {
          const sql2 =
            "UPDATE intern_projects SET pstatus = 'Expired' WHERE pstatus = 'Ongoing'";
          connection.query(sql2, (err, data3) => {
            if (err) {
              console.log(err);
            } else {
              console.log(data3);
            }
          });
        }
      }
    }
  });
};

cron.schedule(
  "0 0 1 * * *",
  () => {
    console.log("running the project schedule");
    ProjectDayIncrement();
    // TaskDayIncrement();
  },
  {
    scheduled: true,
    timezone: "Asia/Karachi", // Set the timezone to Pakistan
  }
);

const GetSubmittedTasks = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM `submitted_task` WHERE `task_id` = ?";
  connection.query(sql, [id], (err, data) => {
    if (err) throw err;
    return res.json(data);
  });
};

const SubmitReview = (req, res) => {
  const { id } = req.params;
  const { points, desc } = req.body.review;

  const sql =
    "UPDATE `intern_tasks` SET `task_obt_mark`= ?,`review`= ? WHERE `task_id` = ?";

  connection.query(sql, [points, desc, id], (err) => {
    if (err) throw err;
    return res.json({ msg: "Review submitted successfully" });
  });
};

const ApproveTask = (req, res) => {
  const { id } = req.params;

  const sql =
    "UPDATE `intern_tasks` SET `task_status_final`= 1 WHERE `task_id` = ?";
  connection.query(sql, [id], (err, data) => {
    if (err) throw err;
    return res.json({ msg: "Task approved successfully" });
  });
};

const RejectTask = (req, res) => {
  const { id } = req.params;

  const sql =
    "UPDATE `intern_tasks` SET `task_status_final`= 0 WHERE `task_id` = ?";
  connection.query(sql, [id], (err, data) => {
    if (err) throw err;
    return res.json({ msg: "Task rejected successfully" });
  });
};

module.exports = {
  GetSupervisorsInterns,
  AssignProject,
  GetAttendance,
  CountAllProjects,
  GetProjects,
  GetTasks,
  GetTaskDetails,
  CountCompProjects,
  CountExpProjects,
  GetInterLeaves,
  ApproveInternLeave,
  RejectInternLeave,
  GetSubmittedTasks,
  SubmitReview,
  ApproveTask,
  RejectTask,
};
