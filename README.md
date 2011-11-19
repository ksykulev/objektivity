objektivity
===========
I needed to be able to parse query strings and turn them into object in my javascript application.
I turned to [Rack](https://github.com/chneukirchen/rack/blob/master/lib/rack/utils.rb), since I knew it had solved the problem before.

I ported the following methods responsible for this into javascript:

* unescape
* parse_query
* parse_nested_query
* normalize_params

The javascript version is not quite as elegant as the ruby version. But it gets the job done.

Example Usage
--------------
```javascript
<script type="text/javascript" src="/js/objektivity.js"></script>
<script>
	//from something like jquery $('form inputs').serialize()
	var serializedForm = "data%5BAppointment%5D%5Bstart_time%5D%5Bmonth%5D%5B%5D=11&data%5BAppointment%5D%5Bstart_time%5D%5Bday%5D%5B%5D=22&data%5BAppointment%5D%5Bstart_time%5D%5Byear%5D%5B%5D=2011&data%5BAppointment%5D%5Bstart_time%5D%5Bhour%5D%5B%5D=9&data%5BAppointment%5D%5Bstart_time%5D%5Bmin%5D%5B%5D=30&data%5BAppointment%5D%5Bstart_time%5D%5Bmeridian%5D%5B%5D=pm&data%5BAppointment%5D%5Bend_time%5D%5Bmonth%5D%5B%5D=11&data%5BAppointment%5D%5Bend_time%5D%5Bday%5D%5B%5D=22&data%5BAppointment%5D%5Bend_time%5D%5Byear%5D%5B%5D=2011&data%5BAppointment%5D%5Bend_time%5D%5Bhour%5D%5B%5D=10&data%5BAppointment%5D%5Bend_time%5D%5Bmin%5D%5B%5D=30&data%5BAppointment%5D%5Bend_time%5D%5Bmeridian%5D%5B%5D=pm&data%5BAppointment%5D%5Blocation%5D%5B%5D=&data%5BAppointment%5D%5Bnotes%5D%5B%5D=";
	objektivity.parseNestedQuery(serializedForm);
	//Would yield:
	{
		data {
			Appointment: {
				location: [''],
				notes: [''],
				start_time: {
					day: ["22"],
					hour: ["9"],
					meridian: ["pm"],
					min: ["30"],
					month: ["11"],
					year: ["2011"]
				},
				end_time: {
					day: ["22"],
					hour: ["10"],
					meridian: ["pm"],
					min: ["30"],
					month: ["11"],
					year: ["2011"]
				}
			}
		}
	}

	objektivity.parseQuery(serializedForm);
	//Would yield:
	{
		data[Appointment][end_time][day][]: "22",
		data[Appointment][end_time][hour][]: "10",
		data[Appointment][end_time][meridian][]: "pm",
		data[Appointment][end_time][min][]: "30",
		data[Appointment][end_time][month][]: "11",
		data[Appointment][end_time][year][]: "2011",
		data[Appointment][location][]: "",
		data[Appointment][notes][]: "",
		data[Appointment][start_time][day][]: "22",
		data[Appointment][start_time][hour][]: "9",
		data[Appointment][start_time][meridian][]: "pm",
		data[Appointment][start_time][min][]: "30",
		data[Appointment][start_time][month][]: "11",
		data[Appointment][start_time][year][]: "2011"
	}
<script>
```

Running the tests
------------------
Just load up /test/specrunner.html in any web browser.

Special Thanks
---------------
To all the people who worked on this functionality in [Rack](https://github.com/chneukirchen/rack).