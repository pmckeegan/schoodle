"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  // Generate string of 16 random alphanumeric characters
  function generateRandomString() {
    let text = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 16; i++) {
      text += str.charAt(Math.floor(Math.random() * str.length));
    }
    return text;
  }

  // GET create event page
  router.get("/", (req, res) => {
    res.render("event");
  });

  // POST create event page
  router.post("/", (req, res) => {
    var eventID = generateRandomString();
    console.log(req.body.title);
    console.log(req.body.note);
    console.log(req.body.location);
    knex("events").insert({
      title: req.body.title,
      description: req.body.note,
      location: req.body.location,
      uniqueURL: eventID
    }).returning('id')
    .then(function (id) {
      knex("options_date").insert([
          {date_option: req.body.date1, event_id: id[0]},
          {date_option: req.body.date2, event_id: id[0]},
          {date_option: req.body.date3, event_id: id[0]}
        ]).then(function (result) {
        res.redirect(`/events/host_confirmation/${eventID}`);
      });
    });
  });

  // GET host confirmation page
  router.get("/host_confirmation/:eventID", (req, res) => {
    console.log(req.params.eventID);
    let templateVars = { eventID: req.params.eventID };
    res.render("host_confirmation", templateVars);
  });

  // GET event URL page
  router.get("/:event_id", (req, res) => {
    knex.select(['events.id as event_id', 'events.title', 'events.location', 'events.description', 'options_date.id as date_id', 'options_date.date_option', 'options_date.votecount']).from('events').innerJoin('options_date', 'events.id', '=', 'options_date.event_id').where('events.uniqueURL', req.params.event_id ).orderBy('options_date.date_option', 'asc')
      .then(function(result) {
        let title = result[0].title;
        let location = result[0].location;
        let description = result[0].description;
        let date_data = [];
        // apply moments function to line 64
        result.forEach((element) => {
          let date_data_info = {
            date: element.date_option,
            id: element.date_id,
            votecount: element.votecount
          };
          date_data.push(date_data_info);
        });
        // let date1 = result[0].date_option
        // let date2 = result[1].date_option
        // let date3 = result[2].date_option
        let templateVars = { eventID: req.params.event_id, data: result, title: title, location: location, description: description, date_data: date_data};
        res.render("event_URL", templateVars );
      });
  });

  // POST event URL page
  router.post("/:event_id", (req, res) => {
    res.redirect(`/${req.params.event_id}/guest_confirmation`);
  });

  // GET guest confirmation page
  router.get("/:event_id/guest_confirmation", (req, res) => {
    let templateVars = { eventID: req.params.event_id };
    res.render("guests_confirmation", templateVars);
  });

  //POST guest confirmation page
  router.post("/:event_id/guest_confirmation", (req, res) => {
    let ids = [];

    if(req.body.date1){
      ids.push(req.body.date1);
    };

    if(req.body.date2){
      ids.push(req.body.date2);
    };

    if(req.body.date3){
      ids.push(req.body.date3);
    };

    knex('options_date')
      .whereIn('id', ids)
      .increment('votecount', 1)
    .then(function(result) {
    res.redirect(`/events/${req.params.event_id}/guest_confirmation`);
    });
  });

  // GET event modify page
  router.get("/:event_id/guest_confirmation/modify", (req, res) => {
    knex.select(['events.id as event_id', 'events.title', 'events.location', 'events.description', 'options_date.id as date_id', 'options_date.date_option', 'options_date.votecount']).from('events').innerJoin('options_date', 'events.id', '=', 'options_date.event_id').where('events.uniqueURL', req.params.event_id ).orderBy('options_date.date_option', 'asc')
      .then(function(result) {
        let title = result[0].title;
        let location = result[0].location;
        let description = result[0].description;
        let date_data = [];
        // apply moments function to line 64
        result.forEach((element) => {
          let date_data_info = {
            date: element.date_option,
            id: element.date_id,
            votecount: element.votecount
          };
          date_data.push(date_data_info);
        });
        // let date1 = result[0].date_option
        // let date2 = result[1].date_option
        // let date3 = result[2].date_option
        let templateVars = { eventID: req.params.event_id, data: result, title: title, location: location, description: description, date_data: date_data};
        res.render("event_modify", templateVars);
      });
  });

  // POST event modify page
  router.post("/:event_id/guest_confirmation/modify", (req, res) => {
    knex.select(['events.id as event_id', 'events.title', 'events.location', 'events.description', 'options_date.id as date_id', 'options_date.date_option', 'options_date.votecount']).from('events').innerJoin('options_date', 'events.id', '=', 'options_date.event_id').where('events.uniqueURL', req.params.event_id ).orderBy('options_date.date_option', 'asc').update({ votecount: 'options_date.event_id' })
      .then(function(result) {
        res.redirect(`events/${req.params.event_id}/guest_confirmation`);
    });
  });

  // GET event results page
  router.get("/:event_id/results", (req, res) => {
    knex.select(['events.id as event_id', 'events.title', 'events.location', 'events.description', 'options_date.id as date_id', 'options_date.date_option', 'options_date.votecount']).from('events').innerJoin('options_date', 'events.id', '=', 'options_date.event_id').where('events.uniqueURL', req.params.event_id ).orderBy('options_date.date_option', 'asc')
      .then(function(result) {
        let title = result[0].title;
        let location = result[0].location;
        let description = result[0].description;
        let date_data = [];
        // apply moments function to line 154
        result.forEach((element) => {
          let date_data_info = {
            date: element.date_option,
            id: element.date_id,
            votecount: element.votecount
          }
          date_data.push(date_data_info);
        })
        // let date1 = result[0].date_option
        // let date2 = result[1].date_option
        // let date3 = result[2].date_option
        let templateVars = { eventID: req.params.event_id, data: result, title: title, location: location, description: description, date_data: date_data};
        res.render("event_results", templateVars);
      });
  });

  // POST event results page
  router.post("/:event_id/results", (req, res) => {
    res.redirect(`/events/${req.params.event_id}/results`);
  });

  // POST event URL page when event is declined
  router.get("/event_URL", (req, res) => {
    res.render (`/${eventID}/guest_confirmation`);
  });

  // DELETE event when guest declines
  router.delete("/:event_id/results", (req, res) => {
    res.redirect(`/events/${req.params.event_id}/results`);
  });

  // Return router
  return router;

}
