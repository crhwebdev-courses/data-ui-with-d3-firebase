const update = data => {
  console.log(data);
};

// data and firestore
let data = [];

db.collection('activities').onSnapshot(res => {
  res.docChanges().forEach(change => {
    const doc = { ...change.doc.data(), id: change.doc.id };

    switch (change.type) {
      case 'added':
        data.push(doc);
        break;
      case 'modified':
        const index = data.findIndex(item => item.id === doc.id);
        data[index] = doc;
        break;
      case 'removed':
        data.filter(item => item.id !== doc.id);
        break;
      default:
        break;
    }
  });

  update(data);
});
