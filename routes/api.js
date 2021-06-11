'use strict';

const mongoose = require('mongoose');

module.exports = function (app) {

  const issueSchema = new mongoose.Schema({
    assigned_to: String,
    status_text: String,
    open: String,
    issue_title: String,
    issue_text: String,
    created_by: String,
    created_on: Date,
    updated_on: Date
  });

  const projectSchema = new mongoose.Schema({
    name: String,
    issues: [issueSchema]
  });

  

  const Issue = mongoose.model('Issue', issueSchema);
  const Project = mongoose.model('Project', projectSchema);

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;

    })

    .post(function (req, res) {
      let project = req.params.project;
      const issue_title = req.body.issue_title;
      const issue_text = req.body.issue_text;
      const created_by = req.body.created_by;
      const assigned_to = req.body.assigned_to;
      const status_text = req.body.status_text;
      const currentTime = new Date();
      console.log(currentTime);
      Project.findOne({ project: project }, function (err, project) {
        if (err) {
          return res.json({ error: 'There was an error with the provided project name.' })
        } else if (project) {
          //the project exists
          //add new issue to project
          const newIssue = new Issue({
            assigned_to: assigned_to,
            status_text: status_text,
            open: 'true',
            issue_title: issue_title,
            issue_text: issue_text,
            created_by: created_by,
            created_on: currentTime,
            updated_on: currentTime
          });
          newIssue.save(function (err, issue) {
            if (err) {
              return console.error(err);
            } else {
              project.issues.push(issue);
              project.save(function (err, data) {
                if (err) {
                  return console.error(err);
                } else {
                  return res.json({
                    assigned_to: issue.assigned_to,
                    status_text: issue.status_text,
                    open: issue.open,
                    _id: issue._id,
                    issue_title: issue.issue_title,
                    issue_text: issue.issue_text,
                    created_by: issue.created_by,
                    created_on: issue.currentTime,
                    updated_on: issue.currentTime
                  });
                }
              });
            }
          });
        } else {
          //create a project
          //add new issue
          const newProject = new Project({ name: project });
          const newIssue = new Issue({
            assigned_to: assigned_to,
            status_text: status_text,
            open: 'true',
            issue_title: issue_title,
            issue_text: issue_text,
            created_by: created_by,
            created_on: currentTime,
            updated_on: currentTime
          });
          newIssue.save(function (err, issue) {
            if(err) {
              return console.error(err)
            } else {
              newProject.issues.push(issue);
              newProject.save(function (err, proj) {
                if (err) {
                  return console.error(err);
                } else {
                  return res.json({
                    assigned_to: issue.assigned_to,
                    status_text: issue.status_text,
                    open: issue.open,
                    _id: issue._id,
                    issue_title: issue.issue_title,
                    issue_text: issue.issue_text,
                    created_by: issue.created_by,
                    created_on: issue.currentTime,
                    updated_on: issue.currentTime
                  });
                }
              })
            }
          });         
        }
      });
    })

    .put(function (req, res) {
      let project = req.params.project;

    })

    .delete(function (req, res) {
      let project = req.params.project;

    });

};
