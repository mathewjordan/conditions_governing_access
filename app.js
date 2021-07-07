const axios = require('axios');
const FormData = require('form-data');
const list = require('./resource_list.json')
const env = require('./env.json')
const _ = require('lodash')

// set vars for authentication
const data = new FormData();
data.append('password', env.password);

// authenticate
axios.post(env.url + '/users/' + env.username + '/login', data,{
  headers: data.getHeaders()
}).then(function(response) {
  handleItems(response)
}).catch(function(error) {
  console.log(error);
});

function handleItems (response) {
  let index = 0;
  for (item of list.resources) {
    let id = item.resource_id;
    index++;
    setTimeout(function () {
      getResource(id, response.data.session);
    }, 110 * index);
  }
}

function getResource (id, session) {
  axios.get(env.url + '/repositories/2/resources/' + id, {
    headers: {
      'X-ArchivesSpace-Session':  session
    }
  }).then(function(response) {
    // console.log(response.data.notes)
    let updatedNote = getNoteIndex(response.data.notes)
    if (updatedNote) {
      response.data.notes = updatedNote;
      console.log('Update ' + id + '.');
      updateResource(id, session, response);
    } else {
      console.log('Nothing to update for ' + id + '.');
    }
  }).catch(function(error) {
    console.log(error);
  });
}

function getNoteIndex (notes) {
  const find = "Collections are stored offsite, and a minimum of 24 hours is needed to retrieve these items for use. Researchers interested in consulting any of the collections are advised to contact Special Collections."
  const replace = "Collections are stored offsite, and a minimum of 2 business days are needed to retrieve these items for use. Researchers interested in consulting any of the collections are advised to contact Special Collections.";
  const index = _.findIndex(notes, function(o) {
    if (o.subnotes !== undefined) {
      if (o.subnotes[0].content.includes(find)) {
        return o;
      } else {
        return null;
      }
    } else {
      return null;
    }
  })
  if (index !== -1) {
    notes[index].subnotes[0].content = replace;
    return notes;
  } else {
    return null;
  }
}

function updateResource (id, session, json) {
  axios.post(env.url + '/repositories/2/resources/' + id, json.data,{
    headers: {
      'X-ArchivesSpace-Session':  session
    }
  }).then(function(response) {
    console.log(response)
  }).catch(function(error) {
    console.log(error);
  });
}
