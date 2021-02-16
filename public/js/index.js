const tableUsers = document.querySelector('.table-users');
const inputDates = document.querySelector('.inputDate');

var login = document.getElementById('#btnLog');
let id;

// Create element and render users
const renderUser = doc => {
    const tr = `
  <tbody id="myTable">
    <tr data-id='${doc.id}'>
      <td><img class="Img" src="${doc.data().image}" alt=""></td>
      <td>${doc.data().name}</td>
      <td>${doc.data().time}</td>
      <td>${doc.data().day}</td> 
      <td>
        <button class="btn btn-delete">Delete</button>
      </td>
    </tr>
    </tbody>
  `;
    tableUsers.insertAdjacentHTML('beforeend', tr);
    // Click delete user
    const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
    btnDelete.addEventListener('click', () => {
        db.collection('user').doc(`${doc.id}`).delete().then(() => {
            console.log('Document succesfully deleted!');
        }).catch(err => {
            console.log('Error removing document', err);
        });
    });
}

function add(name, time, day, image) {
    // e.preventDefault();
    db.collection('user').add({
        name: name,
        time: time,
        day: day,
        image: imgPic
    })
}

var i = 0;
var sum = 0;
var sum2 = 0;
db.collection('user').orderBy('day').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {

        if (change.type === 'added') {
            const t0 = performance.now();
            renderUser(change.doc);
            const t1 = performance.now();
            // document.body.append(`Call to all face of ce took ${t1 - t0} milliseconds.`);
            // console.log(`Call to all face of ce took ${t1 - t0} milliseconds.`);
            sum2 = t1 - t0;
        }
        if (change.type === 'removed') {
            let tr = document.querySelector(`[data-id='${change.doc.id}']`);
            let tbody = tr.parentElement;
            tableUsers.removeChild(tbody);
        }

    })
})




// .limitToLast(5)
// Real time listener