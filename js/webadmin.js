/*
Copyright © 2010 William D. Back
This file is part of gentsim.

gentsim is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

gentsim is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with gentsim.  If not, see <http://www.gnu.org/licenses/>.
*/

///////////////// global settings for connection. ///////////////// 

var url = "ws://10.0.1.6:61614/stomp"
//var url = "ws://localhost:61614/stomp"
var client = Stomp.client(url)

client.debug = function(msg) { 
  $("#debug_messages").append(msg + "<br />")
}

var user     = "guest"
var password = "guest"
var status_cnx_id
var trace_cnx_id

///////////////// system control messages. ///////////////// 

var send_system_control_message = function(msg) {
  client.send("/queue/gentsim.system.control", {}, msg)
}

var send_system_start_message = function() {
  send_system_control_message(system_start_message)
}

var send_system_shutdown_message = function() {
  send_system_control_message(system_shutdown_message)
}

var send_system_pause_message = function() {
  send_system_control_message(system_pause_message)
}

var send_system_step_message = function() {
  send_system_control_message(system_step_message)
}

///////////////// state flags ///////////////// 

var sim_state = "unknown" // valid are running, paused, stopped, awaiting step
var manual_step = false

///////////////// status messages. ///////////////// 

var status_topic = "/topic/gentsim.system.status"

var setInnerHTML = function(htmlId, value) {
  $(htmlId).html(value)
}

set_control_links = function() {
  $("#system_status").html(sim_state)
  if (sim_state == "paused") {
    $("#controllinks").html(
      "<a href=\"javascript:void(0)\" onclick=\"send_system_start_message()\">Start</a>" +
      "&nbsp;" +
      "<a href=\"javascript:void(0)\" onclick=\"send_system_shutdown_message()\">Stop</a>"
      )
  }
  else if (sim_state == "running") {
    if (manual_step) {
      $("#controllinks").html (
        "<a href=\"javascript:void(0)\" onclick=\"send_system_pause_message()\">Pause</a>" +
        "&nbsp;" +
        "<a href=\"javascript:void(0)\" onclick=\"send_system_step_message()\">Step</a>" +
        "&nbsp;" +
        "<a href=\"javascript:void(0)\" onclick=\"send_system_shutdown_message()\">Stop</a>"
      )
    }
    else {
      $("#controllinks").html (
        "<a href=\"javascript:void(0)\" onclick=\"send_system_pause_message()\">Pause</a>" +
        "&nbsp;" +
        "<a href=\"javascript:void(0)\" onclick=\"send_system_shutdown_message()\">Stop</a>"
      )
    }
  }
  else if (sim_state == "stopped") {
    // no links
    $("#controllinks").html("")
  }
  else if (sim_state == "awaiting step") {
    $("#controllinks").html ( 
      "<a href=\"javascript:void(0)\" onclick=\"send_system_pause_message()\">Pause</a>" +
      "&nbsp;" +
      "<a href=\"javascript:void(0)\" onclick=\"send_system_step_message()\">Step</a>" +
      "&nbsp;" +
      "<a href=\"javascript:void(0)\" onclick=\"send_system_shutdown_message()\">Stop</a>"
    )
  }
  else { // unknown state - error?
    $("#system_status").html("unknown")
  }
}

var status_msg_callback = function(msg) {
  debug('msg callback' + msg.body)

  var status_msg = json_parse(msg.body)
  if      (status_msg.type == "system.status.startup") {
    $("#trace_messages").html("") // make sure to clear old messages.
    $("#debug_messages").html("") // make sure to clear old messages.
    if (status_msg.attributes.state == "running") sim_state = "running"
    else                                          sim_state = "paused"
  }
  else if (status_msg.type == "system.status.shutdown") {
    sim_state = "stopped"
  }
  else if (status_msg.type == "system.status.status") {
    // slight overkill since the proper state may be set.
    sim_state = status_msg.attributes.state
    manual_step = status_msg.attributes.manually_stepped == "true"

    $("#system_number_entities").html(status_msg.attributes.number_entities) 
    $("#system_number_services").html(status_msg.attributes.number_services)
    $("#system_cycle_length").html(status_msg.attributes.cycle_length)
    $("#system_timestep").html(status_msg.attributes.timestep)
    $("#system_manually_stepped").html(status_msg.attributes.manually_stepped)
  }

  // change control links if needed.
  set_control_links()

  // all events show time
  $("#system_time").html(status_msg.time)
}

var error_callback = function(error) {
  alert(error)
}

///////////////// trace_messages. ///////////////// 

var trace_topic = "/topic/gentsim.system.trace"

var trace_msg_callback = function(msg) {
  $("#trace_messages").append(msg.body + "<br />")
}

///////////////// Create the client connection. ///////////////// 

var connect_callback = function() {
  status_cnx_id = client.subscribe(status_topic, status_msg_callback)
  trace_cnx_id = client.subscribe(trace_topic, trace_msg_callback)
}

$(document).ready(function() {
  client.connect(user, password, connect_callback, error_callback)
})
