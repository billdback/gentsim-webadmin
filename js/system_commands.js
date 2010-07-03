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
/*
This file contains system commands in JSON format to be used with webapps to control the simulation.
*/
var system_start_message     = '{"simtype" : "event", "type" : "system.control.start", "parameters" : null, "attributes" : null}'
var system_shutdown_message  = '{"simtype" : "event", "type" : "system.control.shutdown", "parameters" : null, "attributes" : null}'
var system_pause_message     = '{"simtype" : "event", "type" : "system.control.pause", "parameters" : null, "attributes" : null}'
