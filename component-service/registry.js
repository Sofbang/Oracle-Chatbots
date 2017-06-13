module.exports =
{

  // Components for testing
  'LocationBasedOptions' : require('./testing/location_options'),
  'WeatherQuery' : require('./testing/weather_query'),
  'VariableSetter' : require('./testing/variable_setter'),
  'MultipleResponses' : require('./testing/multiresponse'),

  // Utility components
  'ActionFromVariable' : require('./util/action_from_variable'),
  'SetVariablesFromFile' : require('./util/set_variables_from_file'),
  'SetVariableFromEntityMatches' : require('./util/set_variable_from_entity_matches'),
  'OutputVariables' : require('./util/output_variables'),
  'ConditionalIsNull' : require('./util/conditional_is_null'),

  //PS Demos - Metropolis City
  'metropolis.FlightArrival' : require('./cityservices/flight_arrival'),
  'metropolis.TransitStatus' : require('./cityservices/transit_status'),
  'metropolis.TransitSchedule' : require('./cityservices/transit_schedule'),

  //Experimental
  'metropolis.getFBLocation' : require('./cityservices/get_fb_location'),
  'metropolis.askFBLocation' : require('./cityservices/ask_fb_location')

};
