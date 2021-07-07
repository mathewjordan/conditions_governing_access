const axios = require('axios');
const FormData = require('form-data');
const list = require('./sample_list.json')
const env = require('./env.json')

// set vars for authentication
const data = new FormData();
data.append('password', env.password);

// authenticate
axios.post(env.url + '/users/' + env.username + '/login', data,{
  headers: data.getHeaders()
}).then(function(response) {
  console.log(response);
}).catch(function(error) {
  console.log(error);
});


for (item of list.resources) {
  console.log(item.resource_id)
}
