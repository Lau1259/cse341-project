const fs = require('fs');



module.exports.getData = () => {
  const data = JSON.parse(fs.readFileSync('public/json/courses.json', 'utf-8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
  }));
  return data;
};


module.exports.details = (id, data) => {
  for (let i=0; i<data.length; i++) {
    console.log(data[i].id === id);
    if (data[i].id === id) {
      return data[i];
    }
  }
};