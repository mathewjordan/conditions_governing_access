const list = require('./resource_list.json')

console.log(list);

for (item of list.resources) {
  console.log(item.resource_id)
}
